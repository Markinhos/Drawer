from django.db import models
from django.db.models.signals import post_save, post_delete
from djangotoolbox.fields import ListField, EmbeddedModelField, DictField
from django.contrib.auth.models import User
from dropbox.session import DropboxSession
from drawapp.drawerApp.forms import EmbeddedModelListFormField
import sys
import hashlib
import binascii
import time
from drawerApp.utils import EvernoteHelper
import evernote.edam.error.ttypes as Errors
from dropbox import client, rest, session
from django.conf import settings
from datetime import datetime
from django_mongodb_engine.contrib import MongoDBManager
from bson.objectid import ObjectId


class EmbeddedModelListField(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, EmbeddedModelListFormField, **kwargs)

class EvernoteProfile(models.Model):
    auth_token = models.CharField(max_length=500)
    secret_auth_token = models.CharField(max_length=500)
    notebook_url = models.URLField()
    edam_userid = models.IntegerField()
    edam_expires = models.IntegerField()
    edam_shard = models.CharField(max_length=10)
    notebook_guid = models.CharField(max_length=500)
    latest_update_count = models.IntegerField(default=0)

class DropboxProfile(models.Model):
    request_token = DictField()
    access_token = DictField()

class FileMetadata(models.Model):
    created = models.DateTimeField(default=datetime.now())
    icon = models.CharField(max_length=100)
    is_dir = models.BooleanField()
    modified = models.DateField()
    path = models.SlugField()
    mime_type = models.CharField(max_length=100)
    revision = models.IntegerField()
    rev = models.SlugField()
    root = models.CharField(max_length=100)
    size = models.CharField(max_length=200)
    thumb_exists = models.BooleanField()
    thumb_url = models.SlugField()
    comments = EmbeddedModelListField(EmbeddedModelField('Comment'), null=True, blank=True)

    @classmethod
    def get_synced_files(cls, user_profile, parent_project):
        sess = DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type=settings.DROPBOX_ACCESS_TYPE)
        sess.set_token(user_profile.dropbox_profile.access_token['key'], user_profile.dropbox_profile.access_token['secret'])
        api_client = client.DropboxClient(sess)
        current_path = parent_project.title + '/'
        resp = api_client.metadata(current_path)

        if 'contents' in resp:

            #Search for removed files on dropbox
            files = parent_project.files
            removed_files = filter(lambda n : n.path not in [file["path"] for file in resp["contents"]], files)
            for f in removed_files:
                parent_project.files.remove(f)
            parent_project.save()


            #Gets all the new or updated files
            for f in resp['contents']:

                local_file = filter(lambda n : n.path == f['path'], files)
                #If the a local file is not found then it is created, otherwise it is updatedfiles
                if len(local_file) is not 1:
                    fileMetadata = FileMetadata()
                    fileMetadata.path = f['path']
                    fileMetadata.modified = datetime.strptime(f['modified'], "%a, %d %b %Y %H:%M:%S +0000")
                    fileMetadata.is_dir = True if f['is_dir'] else False
                    fileMetadata.revision = int(f['revision'])
                    fileMetadata.mime_type = f['mime_type'] if f.has_key('mime_type') else ''
                    fileMetadata.rev = f['rev']
                    fileMetadata.size = f['size']

                    if f['thumb_exists']:
                        fileMetadata.thumb_exists = True
                        fileMetadata.thumb_url, params, headers = api_client.request('/thumbnails/sandbox%s' % f['path'], {'size' : 'large', 'format' : 'JPEG'}, method='GET', content_server=True)
                    else:
                        fileMetadata.thumb_exists = False
                    parent_project.files.append(fileMetadata)
                elif local_file[0].revision < f['revision']:
                    fileMetadata = local_file[0]
                    fileMetadata.path = f['path']
                    fileMetadata.modified = datetime.strptime(f['modified'], "%a, %d %b %Y %H:%M:%S +0000")
                    fileMetadata.is_dir = True if f['is_dir'] else False
                    fileMetadata.revision = int(f['revision'])
                    fileMetadata.mime_type = f['mime_type'] if f.has_key('mime_type') else ''
                    fileMetadata.rev = f['rev']
                    fileMetadata.size = f['size']
                    if f['thumb_exists']:
                        fileMetadata.thumb_exists = True
                        fileMetadata.thumb_url, params, headers = api_client.request('/thumbnails/sandbox%s' % f['path'], {'size' : 'large', 'format' : 'JPEG'}, method='GET', content_server=True)
                    else:
                        fileMetadata.thumb_exists = False
                    parent_project.files.append(fileMetadata)

            parent_project.save()

    def delete_file_dropbox(self, user_profile):
        sess = session.DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type=settings.DROPBOX_ACCESS_TYPE)
        sess.set_token(user_profile.dropbox_profile.access_token['key'], user_profile.dropbox_profile.access_token['secret'])
        drop_client = client.DropboxClient(sess)

        result = drop_client.file_delete(self.path)
        return True


class Comment(models.Model):
    text = models.CharField(max_length=1000)
    created = models.DateTimeField(default=datetime.now())
    modified = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User)
    comments = EmbeddedModelListField(EmbeddedModelField('Comment'), null=True, blank=True)



class Task(models.Model):
    STATUS = ['DONE', 'TODO']
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=50, choices=[(item, item) for item in STATUS])
    created = models.DateTimeField(default=datetime.now(), null=True, blank=True)
    modified = models.DateTimeField(auto_now=True)
    comments = EmbeddedModelListField(EmbeddedModelField('Comment'), null=True, blank=True)
    description = models.CharField(max_length=5000, null=True, blank=True)
    creator = models.OneToOneField(User)
    duedate = models.DateField(null=True,blank=True)
    location = models.CharField(max_length=500, null=True, blank=True)

class Note(models.Model):
    title = models.CharField(max_length=200, default='', blank= True)
    content = models.TextField(max_length=5000)
    created = models.DateTimeField(default=datetime.now(), null=True, blank=True)
    modified = models.DateTimeField(auto_now=True, null=True)
    evernote_usn = models.IntegerField(default=0, blank=True)
    evernote_guid = models.CharField(max_length=200, null=True, blank=True)
    comments = EmbeddedModelListField(EmbeddedModelField('Comment'), null=True, blank=True)
    resources = DictField()

    def save(self):
        super(Note, self).save()

    @classmethod
    def get_synced_notes(cls, user_profile, parent_project):
        evernote_profile = user_profile.evernote_profile
        auth_token = evernote_profile.auth_token
        evernote_helper = EvernoteHelper(evernote_profile)
        note_store = evernote_helper.note_store

        current_state = evernote_helper.current_state_count
        if evernote_profile.latest_update_count < current_state:
            new_notes = evernote_helper.get_metadata_notes(evernote_profile, parent_project)

            #Look for removed notes
            guid_new_notes = [en.guid for en in new_notes.notes]
            removed_notes = [n for n in parent_project.notes if n.evernote_guid not in guid_new_notes]
            for f in removed_notes:
                parent_project.notes.remove(f)

            for metadata_note in new_notes.notes:
                #look for note in db
                notes = parent_project.notes
                local_note = filter(lambda n : n.evernote_guid == metadata_note.guid, notes)
                #If found the note we update the note
                if len(local_note) is 1 and local_note[0].evernote_usn < metadata_note.updateSequenceNum:
                    full_note = note_store.getNote(auth_token, metadata_note.guid, True, True, False, False)
                    local_note = local_note[0]
                    local_note = evernote_helper.copy_evernote_note(full_note, local_note)
                #If not found, a new note is created
                elif len(local_note) is not 1:
                    full_note = note_store.getNote(auth_token, metadata_note.guid, True, True, False, False)
                    local_note = Note()
                    local_note = evernote_helper.copy_evernote_note(full_note, local_note)
                    parent_project.notes.append(local_note)

            evernote_profile.latest_update_count = current_state
            user_profile.save()
            parent_project.save()

    def create_note_evernote(self, user_profile, project):
        auth_token = user_profile.evernote_profile.auth_token
        evernote_helper = EvernoteHelper(user_profile.evernote_profile)
        noteStore = evernote_helper.note_store

        note = evernote_helper.create_note(self.title, self.content, project)

        try:
            created_note = noteStore.createNote(auth_token, note)
        except Errors.EDAMUserException as e:
            return None
        except Errors.EDAMNotFoundException as e:
            return None
        except:
            return None

        #If note is synced fine the usn is updated
        user_profile.evernote_profile.latest_update_count = created_note.updateSequenceNum
        user_profile.save()

        self.evernote_usn = created_note.updateSequenceNum
        self.evernote_guid = created_note.guid
        project.notes[int(self.id)] = self
        project.save()

        return created_note

    def delete_note_evernote(self, user_profile):
        auth_token = user_profile.evernote_profile.auth_token
        evernote_helper = EvernoteHelper(user_profile.evernote_profile)
        noteStore = evernote_helper.note_store

        try:
            update_num = noteStore.deleteNote(auth_token, self.evernote_guid)
        except Errors.EDAMUserException as e:
            return None
        except Errors.EDAMNotFoundException as e:
            return None
        except:
            return None

        user_profile.evernote_profile.latest_update_count = update_num
        user_profile.save()
        return True

    def __unicode__(self):
        return self.title

def update_user_profile_projects_create(sender, instance, created, **kwargs):
    if created:
        user_profile = UserProfile.objects.get(user=instance.user)
        if instance.id not in user_profile.projects:
            user_profile.projects.append(instance.id)
            user_profile.save()
            instance.members.append(user_profile.id)
            instance.save()

def update_user_profile_projects_delete(sender, instance, **kwargs):
    if len(instance.members) == 1:
        user_profile = UserProfile.objects.get(user=instance.user)
        if instance.id in user_profile.projects:
            user_profile.projects.remove(instance.id)
            user_profile.save()

class Project(models.Model):
    user = models.ForeignKey(User)
    tasks = EmbeddedModelListField(EmbeddedModelField('Task'), null=True, blank=True)
    notes = EmbeddedModelListField(EmbeddedModelField('Note'), null=True, blank=True)
    statuses = EmbeddedModelListField(EmbeddedModelField('Comment'), null=True, blank=True)
    files = EmbeddedModelListField(EmbeddedModelField('FileMetadata'), null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=5000)
    created = models.DateTimeField(default=datetime.now(), null=True, blank=True)
    modified = models.DateTimeField(auto_now=True)
    members = ListField(models.ForeignKey(User), editable=False)
    objects = MongoDBManager()

post_delete.connect(update_user_profile_projects_delete, sender=Project)
post_save.connect(update_user_profile_projects_create, sender=Project)

class Invitation(models.Model):
    receiver = models.EmailField()
    project = models.OneToOneField(Project)

class UserProfile(models.Model):
    user = models.OneToOneField(User)
    is_evernote_synced = models.BooleanField()
    is_dropbox_synced = models.BooleanField()
    evernote_profile = EmbeddedModelField(model = EvernoteProfile, null= True)
    dropbox_profile = EmbeddedModelField(model = DropboxProfile, null= True)
    projects = ListField(models.CharField(max_length=24))
    invitations = EmbeddedModelListField(EmbeddedModelField('Invitation'), null=True, blank=True)
    objects = MongoDBManager()
