from drawapp.drawerApp.models import Task
from tastypie.resources import ModelResource

class TaskResource(ModelResource):
    class Meta:
        queryset = Task.objects.all()
        resource_name = 'task'