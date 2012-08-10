from django.db import models
from djangotoolbox.fields import ListField, EmbeddedModelField
from django.contrib.auth.models import User
from drawapp.drawerApp.forms import EmbeddedModelListFormField
import sys
import hashlib
import binascii
import time
from drawerApp.utils import EvernoteHelper
from evernote.edam.notestore.ttypes import NotesMetadataResultSpec
import thrift.protocol.TBinaryProtocol as TBinaryProtocol
import thrift.transport.THttpClient as THttpClient
import evernote.edam.userstore.UserStore as UserStore
import evernote.edam.userstore.constants as UserStoreConstants
import evernote.edam.notestore.NoteStore as NoteStore
import evernote.edam.type.ttypes as Types
import evernote.edam.error.ttypes as Errors


class EmbeddedModelListField(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, EmbeddedModelListFormField, **kwargs)

class EvernoteProfile(models.Model):
    auth_token = "S=s1:U=2b020:E=1402f30e366:C=138d77fb766:P=1cd:A=en-devtoken:H=6d184bd37dbf135150efeba02c89ebb3"
    notebook_guid = models.CharField(max_length=500)
    latest_update_count = models.IntegerField(default=0)

class UserProfile(models.Model):
    user = models.OneToOneField(User)
    is_evernote_synced = models.BooleanField()
    evernote_profile = EmbeddedModelField(model = EvernoteProfile, null= True)

class Task(models.Model):
    STATUS = ['DONE', 'TODO']
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=50, choices=[(item, item) for item in STATUS])
    created_date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.title

class Note(models.Model):
    title = models.CharField(max_length=200, default='', blank= True)
    content = models.TextField(max_length=5000)
    snipett = models.TextField(max_length=5000)
    created_date = models.DateTimeField(auto_now=True)
    modified_date = models.DateTimeField(auto_now_add=True, null=True)
    evernote_usn = models.IntegerField(default=0, blank=True)
    evernote_guid = models.CharField(max_length=200, null=True, blank=True)

    def save(self):
        super(Note, self).save()

    @classmethod
    def get_synced_notes(cls, user_profile, parent_project):
        evernote_profile = user_profile.evernote_profile
        auth_token = evernote_profile.auth_token
        evernote_helper = EvernoteHelper(auth_token)
        note_store = evernote_helper.note_store

        current_state = evernote_helper.current_state_count
        if evernote_profile.latest_update_count < current_state:
            new_notes = evernote_helper.get_metadata_notes(evernote_profile)

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

    def sync_note_evernote(self, evernote_profile):
        auth_token = evernote_profile.auth_token
        evernote_helper = EvernoteHelper(auth_token)
        noteStore = evernote_helper.note_store

        note = evernote_helper.create_note(self.title, self.content)

        try:
            created_note = noteStore.createNote(auth_token, note)
        except Errors.EDAMUserException, Errors.EDAMNotFoundException:
            return None
        except Exception:
            return None

        #If note is synced fine the usn is updated
        evernote_profile.latest_update_count = created_note.usn
        evernote_profile.save()

        return created_note

    def __unicode__(self):
        return self.title

class Project(models.Model):
    user = models.ForeignKey(User)
    tasks = EmbeddedModelListField(EmbeddedModelField('Task'), null=True, blank=True)
    notes = EmbeddedModelListField(EmbeddedModelField('Note'), null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=5000)
    pub_date = models.DateTimeField(auto_now_add=True)
    def save(self):
        super(Project, self).save()

