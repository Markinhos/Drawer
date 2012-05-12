from django.conf.urls.defaults import *
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from drawerApp.api import TaskResource
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

task_resource = TaskResource()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Drawer.views.home', name='home'),
    # url(r'^Drawer/', include('Drawer.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/', 'django.contrib.auth.views.login', name="Login"),
    url(r'^tasks/$', 'drawerApp.views.task.index', name="TaskIndex"
    ),
    url(r'^tasks/add$', 'drawerApp.views.task.add'
    ),
    url(r'^tasks/create', 'drawerApp.views.task.create'),
    url(r'^tasks/detail/(?P<task_id>.+)', 'drawerApp.views.task.detail' ),

    url(r'^$', 'drawerApp.views.project.index', name="Home"
    ),
    url(r'^project/create', 'drawerApp.views.project.create'),
    url(r'^project/add', 'drawerApp.views.project.add'),
    url(r'^project/detail/(?P<project_id>.+)', 'drawerApp.views.project.detail' ),
    url(r'^api/', include(task_resource.urls)),
)
urlpatterns += staticfiles_urlpatterns()