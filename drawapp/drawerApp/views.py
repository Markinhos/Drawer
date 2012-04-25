from django.http import HttpResponseRedirect
from models import Task, Project
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from datetime import datetime

def index(request):
    project_collection = Project.objects.all()
    output = ', '.join([p.title for p in project_collection])
    return render_to_response('home.html', { 'task_collection' : project_collection}, context_instance = RequestContext(request))
def project_create(request):
    p = Project()
    p.title = request.POST['title']
    p.created_date = datetime.now()
    p.save()
    return HttpResponseRedirect(reverse('Home'))
def project_add(request):
    p = Project()
    return render_to_response('projects/add.html', { 'project' : p}, context_instance = RequestContext(request))
def task_list(request):
    task_collection = Task.objects.all().order_by('-created_date')
    output = ', '.join([p.title for p in task_collection])
    return render_to_response('tasks/task_list.html', { 'task_collection' : task_collection}, context_instance = RequestContext(request))
def task_add(request):
    t = Task()
    return render_to_response('tasks/add_task.html', { 'task' : t}, context_instance = RequestContext(request))
def task_create(request):
    t = Task()
    t.title = request.POST['title']
    t.created_date = datetime.now()
    t.save()
    return HttpResponseRedirect(reverse('TaskIndex'))
def task_detail(request, task_id):
    t = Task.objects.get(pk=task_id)
    return render_to_response('tasks/detail.html', { 'task' : t}, context_instance = RequestContext(request))