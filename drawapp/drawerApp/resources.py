from drawapp.drawerApp.models import Task, Project, UserProfile
from drawapp.drawerApp.modelforms import ProjectForm, TaskForm
from tastypie.authorization import Authorization
from tastypie import fields
from tastypie.validation import FormValidation
from django.contrib.auth.models import User
from drawapp.tastypie_nonrel.resources import MongoResource, MongoListResource
from drawapp.tastypie_nonrel.fields import EmbeddedCollection

class UserResource(MongoResource):

    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'


class TaskResource(MongoResource):
    tasks = EmbeddedCollection(of = 'drawapp.drawerApp.api.TaskCollectionResource', attribute = 'tasks', null=True, blank=True, full=True)
    class Meta:
        queryset = Project.objects.all()
        resource_name = 'task'
        authorization = Authorization()

class TaskCollectionResource(MongoListResource):
    class Meta:
        object_class        =   Task
        queryset            =   Task.objects.all()
        resource_name       =   'task'
        authorization       =   Authorization()
        validation          =   FormValidation(form_class=TaskForm)

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
    class Meta:
        queryset            =    Project.objects.all()
        resource_name       =    'project'
        authorization       =    Authorization()
        allowed_methods     =    ['get', 'post', 'put', 'delete']
        validation          =    FormValidation(form_class=ProjectForm)
        filtering = {
            "title": ('exact', 'startswith'),
        }
