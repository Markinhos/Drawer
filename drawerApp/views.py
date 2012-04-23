from django.http import HttpResponseRedirect
from drawerApp.models import Task
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from datetime import datetime

def index(request):
    task_collection = Task.objects.all().order_by('-created_date')
    output = ', '.join([p.title for p in task_collection])
    return render_to_response('tasks/task_list.html', { 'task_collection' : task_collection}, context_instance = RequestContext(request))
def add(request):
    t = Task()
    return render_to_response('tasks/add_task.html', { 'task' : t}, context_instance = RequestContext(request))
def create(request):
    t = Task()
    t.title = request.POST['title']
    t.created_date = datetime.now()
    t.save()
    return HttpResponseRedirect(reverse('TaskIndex'))
def detail(request, task_id):
    t = Task.objects.get(pk=task_id)
    return render_to_response('tasks/detail.html', { 'task' : t})