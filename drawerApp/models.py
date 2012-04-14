from django.db import models
from django.forms import ModelForm

class Task(models.Model):
    title = models.CharField(max_length=200)
    created_date = models.DateTimeField('Date created')

class TaskForm(ModelForm):
    class Meta:
        model = Task