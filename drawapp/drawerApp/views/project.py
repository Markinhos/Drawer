from django.http import HttpResponseRedirect
from drawapp.drawerApp.models import Project
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from datetime import datetime

def index(request):
    project_collection = Project.objects.all()
    output = ', '.join([p.title for p in project_collection])
    return render_to_response('home.html', { 'project_collection' : project_collection}, context_instance = RequestContext(request))
def create(request):
    p = Project()
    p.title = request.POST['title']
    p.pub_date = datetime.now()
    p.save()
    return HttpResponseRedirect(reverse('Home'))
def add(request):
    p = Project()
    return render_to_response('projects/add.html', { 'project' : p}, context_instance = RequestContext(request))
def detail(request, project_id):
    p = Project.objects.get(pk=project_id)
    return render_to_response('projects/detail.html', { 'project' : p}, context_instance = RequestContext(request))
