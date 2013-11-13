from django.conf.urls.defaults import *
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from drawerApp.resources import ProjectResource, UserResource, UserProfileResource
from tastypie.api import Api
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from django.conf import settings
admin.autodiscover()


v1 = Api(api_name="v1")
v1.register(ProjectResource())
v1.register(UserResource())
v1.register(UserProfileResource())

urlpatterns = staticfiles_urlpatterns()
urlpatterns += patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/', 'django.contrib.auth.views.login', { 'template_name': 'registration/login.html'}, name="login"),
    url(r'^logout/', 'django.contrib.auth.views.logout_then_login', name="logout"),
    url(r'^signup/', 'drawerApp.views.signup', name="signup"),
    url(r'^evernote-url/', 'drawerApp.views.get_evernote_auth_url'),
    url(r'^dropbox-url/', 'drawerApp.views.get_dropbox_auth_url'),
    url(r'^dropbox-access-token/', 'drawerApp.views.get_dropbox_access_token'),
    url(r'^evernote-access-token/', 'drawerApp.views.get_evernote_access_token'),
    url(r'^upload-dropbox-file/', 'drawerApp.views.upload_dropbox_file'),
    url(r'^upload-dropbox-files/', 'drawerApp.views.multiuploader'),    
    url(r'^get-dropbox-thumbnail/', 'drawerApp.views.get_dropbox_thumbnail'),
    url(r'^get-evernote-image/', 'drawerApp.views.get_evernote_image'),
    url(r'^get-evernote-thumbnail/', 'drawerApp.views.get_evernote_thumbnail'),
    url(r'^get-dropbox-file/', 'drawerApp.views.get_dropbox_file'),
    url(r'^get-dropbox-share/', 'drawerApp.views.get_dropbox_share'),
    url(r'^change-settings/', 'drawerApp.views.change_user_settings'),
    url(r'^disconnect-dropbox/', 'drawerApp.views.disconnect_dropbox'),
    url(r'^disconnect-evernote/', 'drawerApp.views.disconnect_evernote'),
    url(r'^api/', include(v1.urls)),
    url(r'^.*$', 'drawerApp.views.index', name="Home"
    ),
)