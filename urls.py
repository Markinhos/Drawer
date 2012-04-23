from django.conf.urls.defaults import patterns, include, url
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Drawer.views.home', name='home'),
    # url(r'^Drawer/', include('Drawer.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'drawerApp.views.index', name="TaskIndex"
    ),
    url(r'^tasks/$', 'drawerApp.views.index', name="TaskIndex"
    ),
    url(r'^tasks/add$', 'drawerApp.views.add'
    ),
    url(r'^tasks/create', 'drawerApp.views.create'),
    url(r'^tasks/detail/(?P<task_id>\d+)', 'drawerApp.views.detail' ),
)
