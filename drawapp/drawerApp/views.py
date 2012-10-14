import urllib
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login
from dropbox import session, client
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from drawerApp.models import UserProfile
from django.shortcuts import redirect, render
from permission_backend_nonrel import utils

def index(request):
    context = {}
    if request.user.id is not None:
        user_profile = UserProfile.objects.get(user = request.user)
        context = {'user_profile': user_profile,}
    return render(request, 'home.html', context)

def signup(request):
    if request.method == 'POST':
        user_name = request.POST.get('username', None)
        user_password = request.POST.get('userpassword', None)
        user_mail = request.POST.get('usermail', None)

        user = User.objects.create_user(user_name, user_mail, user_password)

        #Includes in group regular users
        group = Group.objects.get(name='Users')
        utils.add_user_to_group(user,group)

        user_profile = UserProfile()
        user_profile.user = user
        user.save()
        user_profile.save()


        user = authenticate(username = user_name, password= user_password)
        login(request, user)
        return redirect("/")


def get_dropbox_auth_url(request):
    if request.method == 'GET':
        user_profile = UserProfile.objects.get(user = request.user)
        callback_url = request.GET.get('callback_url')
        sess = session.DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type= settings.DROPBOX_ACCESS_TYPE)
        request_token = sess.obtain_request_token()
        url = sess.build_authorize_url(request_token, callback_url)
        user_profile.dropbox_profile.request_token =  { "key" : request_token.key, "secret": request_token.secret}
        user_profile.save()
        return redirect(url)


def get_dropbox_access_token(request):
    if request.method == "GET":
        user_profile = UserProfile.objects.get(user = request.user)
        request_token = user_profile.dropbox_profile.request_token
        sess = session.DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type= settings.DROPBOX_ACCESS_TYPE)
        request_token = session.OAuthToken(request_token['key'], request_token['secret'])
        access_token = sess.obtain_access_token(request_token)

        user_profile.dropbox_profile.access_token = { "key" : access_token.key, "secret": access_token.secret}
        user_profile.dropbox_profile.is_dropbox_synced = True
        user_profile.save()
        return redirect("/project/{0}/files/".format(request.GET.get('project_id')))

def upload_dropbox_file(request):
    if request.method == 'POST':
        user_profile = UserProfile.objects.get(user = request.user)
        sess = session.DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type=settings.DROPBOX_ACCESS_TYPE)
        sess.set_token(user_profile.dropbox_profile.access_token['key'], user_profile.dropbox_profile.access_token['secret'])
        drop_client = client.DropboxClient(sess)

        file = request.FILES['file']
        result = drop_client.put_file('/' + file.name, file.file)

        dest_path = result['path']

        return redirect("/project/{0}/files/".format(request.POST.get('project_id')))