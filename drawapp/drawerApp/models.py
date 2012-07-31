from django.db import models
from djangotoolbox.fields import ListField, EmbeddedModelField
from django.contrib.auth.models import User
from drawapp.drawerApp.forms import EmbeddedModelListFormField


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

class Note(models.Model):
    content = models.TextField(max_length=5000)
    created_date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.title

class Project(models.Model):
    user = models.ForeignKey(User)
    tasks = EmbeddedModelListField(EmbeddedModelField('Task'), null=True, blank=True)
    notes = EmbeddedModelListField(EmbeddedModelField('Note'), null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=5000)
    pub_date = models.DateTimeField(auto_now_add=True)


