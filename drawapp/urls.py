from django.conf.urls.defaults import *
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from drawerApp.resources import ProjectResource, UserResource, UserProfileResource
from tastypie.api import Api
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()


v1 = Api(api_name="v1")
v1.register(ProjectResource())
v1.register(UserResource())
v1.register(UserProfileResource())

urlpatterns = staticfiles_urlpatterns()
urlpatterns += patterns('',
    # Examples:
    # url(r'^$', 'Drawer.views.home', name='home'),
    # url(r'^Drawer/', include('Drawer.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/', 'django.contrib.auth.views.login', { 'template_name': 'registration/loginTemplate.html'}, name="login"),
    url(r'^logout/', 'django.contrib.auth.views.logout_then_login', name="logout"),
    url(r'^signup/', 'drawerApp.views.signup', name="signup"),
    url(r'^dropbox-url/', 'drawerApp.views.get_dropbox_auth_url'),
    url(r'^dropbox-access-token/', 'drawerApp.views.get_dropbox_access_token'),
    url(r'^upload-dropbox-file/', 'drawerApp.views.upload_dropbox_file'),
    url(r'^api/', include(v1.urls)),
    url(r'^.*$', 'drawerApp.views.index', name="Home"
    ),
)
