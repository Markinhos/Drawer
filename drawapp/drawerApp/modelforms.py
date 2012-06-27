from drawapp.drawerApp.models import Project, Task
from django.forms.models import ModelForm
from django.forms.fields import ChoiceField

class TaskForm(ModelForm):
    status = ChoiceField(required=True, choices=[(item, item) for item in Task.STATUS])

    class Meta:
        model = Task

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