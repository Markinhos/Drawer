from django.db import models
from django.forms.models import ModelForm
from django.forms.fields import ChoiceField
from djangotoolbox.fields import ListField, EmbeddedModelField
from django.contrib.auth.models import User
from drawapp.drawerApp.forms import EmbeddedModelListFormField
from django.core.exceptions import ValidationError


class EmbeddedModelListField(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, EmbeddedModelListFormField, **kwargs)

class UserProfile(models.Model):
    user = models.OneToOneField(User)

class Task(models.Model):
    STATUS = ['DONE', 'TODO']
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=50, choices=[(item, item) for item in STATUS])
    created_date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.title

class TaskForm(ModelForm):
    status = ChoiceField(required=True, choices=[(item, item) for item in Task.STATUS])
    """def __init__(self, object, *args, **kwargs):
        self.object = object
        return super(TaskForm, self).__init__(*args, **kwargs)
    def save(self, *args):
        self.object.tasks.append(self.instance)
        self.object.save()"""

    class Meta:
        model = Task

class Project(models.Model):
    user = models.ForeignKey(User)
    tasks = EmbeddedModelListField(EmbeddedModelField('Task'), null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=5000)
    pub_date = models.DateTimeField(auto_now_add=True)

class ProjectForm(ModelForm):
    class Meta:
        model = Project
        exclude = ('user')
    def clean_description(self):
        data = self.cleaned_data['description']
        return data
    def clean_tasks(self):
        for task in self.cleaned_data['tasks']:
            taskForm = TaskForm(task)
            if not taskForm.is_valid():
                self._errors["error"] = taskForm.errors

