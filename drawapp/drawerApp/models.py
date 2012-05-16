from django.db import models
from djangotoolbox.fields import ListField
from django.contrib.auth.models import User

class Project(models.Model):
    user_id = models.ForeignKey(User)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=1000)
    pub_date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.title

class Task(models.Model):
    project_id = models.ForeignKey(Project )
    title = models.CharField(max_length=200)
    created_date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.title