from django.db import models
from djangotoolbox.fields import ListField

class Task(models.Model):
    title = models.CharField(max_length=200)
    comments = ListField()
    created_date = models.DateTimeField('Date created')

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=1000)
    pub_date = models.DateTimeField('Creation date')

class User(models.Model):
    nick = models.CharField(max_length=200)
