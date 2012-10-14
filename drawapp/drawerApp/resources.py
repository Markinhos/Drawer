from drawapp.drawerApp.models import Task, Project, UserProfile, Note, FileMetadata, Comment
from drawapp.drawerApp.modelforms import ProjectForm, TaskForm, NoteForm, FileMetadataForm, CommentForm
from tastypie.authorization import Authorization
from tastypie import fields, utils
from tastypie.authorization import DjangoAuthorization
from tastypie.authentication import BasicAuthentication, Authentication
from datetime import datetime
from tastypie.validation import FormValidation
from django.contrib.auth.models import User
from drawapp.tastypie_nonrel.resources import MongoResource, MongoListResource
from drawapp.tastypie_nonrel.fields import EmbeddedCollection
from drawerApp.utils import EvernoteHelper

class UserResource(MongoResource):

    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        
class UserProfileResource(MongoResource):
    user = fields.ForeignKey(UserResource, 'user', full=True)
    class Meta:
        queryset = UserProfile.objects.all()
        resource_name = 'userProfile'
        authorization = Authorization()
        excludes = ['dropbox_profile', 'evernote_profile']
"""class TaskResource(MongoResource):
    tasks = EmbeddedCollection(of = 'drawapp.drawerApp.api.TaskCollectionResource', attribute = 'tasks', null=True, blank=True, full=True)
    class Meta:
        queryset = Project.objects.all()
        resource_name = 'task'
        authorization = Authorization()

class NoteResource(MongoResource):
    tasks = EmbeddedCollection(of = 'drawapp.drawerApp.api.NoteCollectionResource', attribute = 'notes', null=True, blank=True, full=True)
    class Meta:
        queryset = Project.objects.all()
        resource_name = 'note'
        authorization = Authorization()"""

class CommentCollectionResource(MongoListResource):
    owner = fields.ForeignKey(UserResource, 'owner')
    owner_name = fields.CharField(readonly=True)
    comments = EmbeddedCollection(of = 'drawapp.drawerApp.resources.CommentCollectionResource', attribute = 'comments', null=True, blank=True, full=True)

    class Meta:
        object_class        =   Comment
        queryset            =   Comment.objects.all()
        resource_name       =   'comment'
        authorization       =   Authorization()

    def dehydrate_owner_name(self, bundle):
        return bundle.obj.owner.username

class FileMetadataCollectionResource(MongoListResource):
    created = fields.DateTimeField(default = datetime.now)
    comments = EmbeddedCollection(of = CommentCollectionResource, attribute = 'comments', null=True, blank=True, full=True)

    class Meta:
        object_class        =   FileMetadata
        queryset            =   FileMetadata.objects.all()
        resource_name       =   'fileMetadata'
        authorization       =   Authorization()
        validation          =   FormValidation(form_class=FileMetadataForm)

    def get_list(self, request, **kwargs):
        user_profile = UserProfile.objects.get(user = request.user)
        if True:
            project = Project.objects.get(pk = self.instance.pk)
            FileMetadata.get_synced_files(user_profile, project)
        return super(FileMetadataCollectionResource, self).get_list(request, **kwargs)

class TaskCollectionResource(MongoListResource):
    created = fields.DateTimeField(default = datetime.now, null=True, blank=True)
    modified = fields.DateTimeField(default = datetime.now)
    comments = EmbeddedCollection(of = CommentCollectionResource, attribute = 'comments', null=True, blank=True, full=True)

    class Meta:
        object_class        =   Task
        queryset            =   Task.objects.all()
        resource_name       =   'task'
        authorization       =   Authorization()
        validation          =   FormValidation(form_class=TaskForm)

class NoteCollectionResource(MongoListResource):
    title = fields.CharField(attribute= 'title', default='', blank = True)
    evernote_usn = fields.IntegerField(default=0, blank=True, null=True)
    evernote_guid = fields.CharField(null=True, blank=True)
    modified = fields.DateTimeField(default = datetime.now)
    created = fields.DateTimeField(default = datetime.now)
    snipett = fields.CharField(readonly=True)
    comments = EmbeddedCollection(of = CommentCollectionResource, attribute = 'comments', null=True, blank=True, full=True)

    class Meta:
        object_class        =   Note
        queryset            =   Note.objects.all()
        resource_name       =   'note'
        authorization       =   Authorization()
        validation          =   FormValidation(form_class=NoteForm)

    def dehydrate_snipett(self, bundle):
        return EvernoteHelper.create_snipett(bundle.obj.content)

    def obj_create(self, bundle, request=None, **kwargs):
        bundle = super(NoteCollectionResource, self).obj_create(bundle,request, **kwargs)
        #Check if evernote accout is set up
        """user_profile = UserProfile.objects.get(user = request.user)
        if user_profile.is_evernote_synced:
            self.instance.notes[int(bundle.obj.id)].sync_note_evernote(user_profile)"""
        return bundle

    def get_list(self, request, **kwargs):
        user_profile = UserProfile.objects.get(user = request.user)
        if user_profile.is_evernote_synced:
            project = Project.objects.get(pk = self.instance.pk)
            Note.get_synced_notes(user_profile, project)
        return super(NoteCollectionResource, self).get_list(request, **kwargs)

class ProjectResource(MongoResource):
    user = fields.ForeignKey(UserResource, 'user')
    tasks = EmbeddedCollection(of = TaskCollectionResource, attribute = 'tasks', null=True, blank=True, full=True)
    notes = EmbeddedCollection(of = NoteCollectionResource, attribute = 'notes', null=True, blank=True, full=True)
    statuses = EmbeddedCollection(of = CommentCollectionResource, attribute = 'statuses', null=True, blank=True, full=True)
    files = EmbeddedCollection(of = FileMetadataCollectionResource, attribute = 'files', null=True, blank=True, full=True)
    created = fields.DateTimeField(default = datetime.now)

    class Meta:
        queryset            =    Project.objects.all()
        resource_name       =    'project'
        authorization       =    DjangoAuthorization()
        authentication      =    Authentication()
        allowed_methods     =    ['get', 'post', 'put', 'delete']
        validation          =    FormValidation(form_class=ProjectForm)
        filtering = {
            "title": ('exact', 'startswith'),
        }
    def obj_create(self, bundle, request=None, **kwargs):
        return super(ProjectResource, self).obj_create(bundle, request, **kwargs)
    def apply_authorization_limits(self, request, object_list):
        if request.user.is_active:
            user_profile = UserProfile.objects.get(user=request.user)
            return object_list.filter(id__in=user_profile.projects)
            #return object_list.filter(user=request.user)
        else:
            return []