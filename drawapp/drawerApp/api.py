from drawapp.drawerApp.models import Task, Project, UserProfile
from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie import fields, http
from tastypie.http import HttpGone
from tastypie.utils.urls import trailing_slash
from tastypie.fields import (CharField,
                            ForeignKey,
    )
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.contrib.auth.models import User
from django.conf.urls.defaults import url
from drawapp.tastypie_nonrel.resources import MongoResource, MongoListResource
from drawapp.tastypie_nonrel.fields import (ListField,
                            DictField,
                            EmbeddedModelField,
                            EmbeddedListField,
                            EmbeddedCollection,
    )

class UserResource(MongoResource):

    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'


class TaskResource(MongoResource):
    task_list = EmbeddedCollection(of = 'drawapp.drawerApp.api.TaskCollectionResource', attribute = 'task_list', null=True, blank=True, full=True)
    class Meta:
        queryset = Project.objects.all()
        resource_name = 'task'
        authorization = Authorization()

class TaskCollectionResource(MongoListResource):
    class Meta:
        object_class = Task
        queryset = Task.objects.all()
        resource_name = 'task'
        authorization = Authorization()

class ProjectListResource(MongoResource):
    user = fields.ForeignKey(UserResource, 'user')
    class Meta:
        queryset = Project.objects.all()
        resource_name = 'projectList'
        authorization = Authorization()
        excludes = ['task_list']
        filtering = {
            "title": ('exact', 'startswith'),
        }

class ProjectResource(MongoResource):
    user = fields.ForeignKey(UserResource, 'user', full=True)
    task_list = EmbeddedCollection(of = TaskCollectionResource, attribute = 'task_list', null=True, blank=True, full=True)
    class Meta:
        queryset = Project.objects.all()
        resource_name = 'project'
        authorization = Authorization()
        filtering = {
            "title": ('exact', 'startswith'),
            }

