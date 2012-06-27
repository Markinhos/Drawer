from drawapp.drawerApp.models import Project
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required

@login_required()
def index(request):
    project_collection = Project.objects.all()
    output = ', '.join([p.title for p in project_collection])
    return render_to_response('home.html', { 'project_collection' : project_collection}, context_instance = RequestContext(request))
