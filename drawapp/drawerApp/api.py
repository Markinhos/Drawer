from drawapp.drawerApp.models import Task, Project
from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie import fields
from tastypie.api import Api
from django.contrib.auth.models import User

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'

class ProjectResource(ModelResource):
    class Meta:
        queryset = Project.objects.all()
        resource_name = 'project'
        authorization = Authorization()

class TaskResource(ModelResource):
    project = fields.ForeignKey(ProjectResource, 'project_id')

    class Meta:
        queryset = Task.objects.all()
        resource_name = 'task'
        authorization = Authorization()