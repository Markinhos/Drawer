from django.db import models
import datetime

class Task(models.Model):
    title = models.CharField(max_length=200)
    created_date = models.DateTimeField('Date created')