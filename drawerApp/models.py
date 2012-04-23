from django.db import models
from djangotoolbox.fields import ListField

class Task(models.Model):
    title = models.CharField(max_length=200)
    comments = ListField()
    created_date = models.DateTimeField('Date created')