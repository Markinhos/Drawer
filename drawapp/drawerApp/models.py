from django.db import models
from djangotoolbox.fields import ListField

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=1000)
    tags = ListField()
    pub_date = models.DateTimeField('Creation date')

class Task(models.Model):
    title = models.CharField(max_length=200)
    comments = ListField()
    created_date = models.DateTimeField(auto_now_add=True)
