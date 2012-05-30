from django.db import models
from djangotoolbox.fields import ListField, EmbeddedModelField
from django.contrib.auth.models import User
from drawapp.drawerApp.forms import StringListField


class CategoryField(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, StringListField, **kwargs)

class UserProfile(models.Model):
    user = models.OneToOneField(User)

class Task(models.Model):
    title = models.CharField(max_length=200)
    created_date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.title

class Project(models.Model):
    user = models.ForeignKey(User)
    task_list = CategoryField(EmbeddedModelField('Task'), null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=1000)
    pub_date = models.DateTimeField(auto_now_add=True)
