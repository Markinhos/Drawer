from drawapp.drawerApp.models import Task, Project, UserProfile, Note
from drawapp.drawerApp.modelforms import ProjectForm, TaskForm, NoteForm
from tastypie.authorization import Authorization
from tastypie import fields, utils
from datetime import datetime
from tastypie.validation import FormValidation
from django.contrib.auth.models import User
from drawapp.tastypie_nonrel.resources import MongoResource, MongoListResource
from drawapp.tastypie_nonrel.fields import EmbeddedCollection

class UserResource(MongoResource):

    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'

class UserProfileResource(MongoResource):
    class Meta:
        queryset = UserProfile.objects.all()
        resource_name = 'userProfile'
        authorization = Authorization()
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

class TaskCollectionResource(MongoListResource):
    created_date = fields.DateTimeField(default = datetime.now)
    class Meta:
        object_class        =   Task
        queryset            =   Task.objects.all()
        resource_name       =   'task'
        authorization       =   Authorization()
        validation          =   FormValidation(form_class=TaskForm)

class NoteCollectionResource(MongoListResource):
    title = fields.CharField(attribute= 'title', null = True, blank = True)
    created_date = fields.DateTimeField(default = datetime.now)
    class Meta:
        object_class        =   Note
        queryset            =   Note.objects.all()
        resource_name       =   'note'
        authorization       =   Authorization()
        validation          =   FormValidation(form_class=NoteForm)

    def obj_create(self, bundle, request=None, **kwargs):
        bundle = super(NoteCollectionResource, self).obj_create(bundle,request, **kwargs)
        #Check if evernote accout is set up
        #user_profile = UserProfile.objects.get(request.user)
        #self.instance.notes[0].sync_note_evernote("testing oha")
        return bundle

class ProjectListResource(MongoResource):
    user = fields.ForeignKey(UserResource, 'user')
    class Meta:
        queryset = Project.objects.all()
        resource_name = 'projectList'
        authorization = Authorization()
        excludes = ['tasks']
        filtering = {
            "title": ('exact', 'startswith'),
        }

class ProjectResource(MongoResource):
    user = fields.ForeignKey(UserResource, 'user')
    tasks = EmbeddedCollection(of = TaskCollectionResource, attribute = 'tasks', null=True, blank=True, full=True)
    notes = EmbeddedCollection(of = NoteCollectionResource, attribute = 'notes', null=True, blank=True, full=True)
    class Meta:
        queryset            =    Project.objects.all()
        resource_name       =    'project'
        authorization       =    Authorization()
        allowed_methods     =    ['get', 'post', 'put', 'delete']
        validation          =    FormValidation(form_class=ProjectForm)
        filtering = {
            "title": ('exact', 'startswith'),
        }
