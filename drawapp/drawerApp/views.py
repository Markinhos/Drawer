import urllib
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group, Permission
from django.contrib.auth import authenticate, login
from dropbox import session, client
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from drawerApp.models import UserProfile, EvernoteProfile, DropboxProfile, Project
from django.shortcuts import redirect, render
from permission_backend_nonrel import utils
from dropbox.session import DropboxSession
import urllib2, cgi, datetime
from drawerApp.utils import EvernoteHelper
from urllib import urlencode
from django.utils import simplejson

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
        group, created = Group.objects.get_or_create(name='Users')
        if created:
            utils.add_permission_to_group(Permission.objects.get(codename='add_project'), group)
            utils.add_permission_to_group(Permission.objects.get(codename='change_project'), group)
            utils.add_permission_to_group(Permission.objects.get(codename='delete_project'), group)

        utils.add_user_to_group(user,group)
        user.save()

        user_profile = UserProfile()
        user_profile.user = user
        user_profile.evernote_profile = EvernoteProfile()
        user_profile.dropbox_profile = DropboxProfile()
        user_profile.is_dropbox_synced, user_profile.is_evernote_synced = False, False
        user_profile.invitations = []
        user_profile.save()
        user = authenticate(username = user_name, password= user_password)

        login(request, user)
        return redirect("/")

def get_evernote_auth_url(request):

    if request.method == 'GET':
        user_profile = UserProfile.objects.get(user = request.user)
        callback_url = request.GET.get('callback_url')
        project_id = request.GET.get('project_id')
        url_evernote = "https://sandbox.evernote.com/oauth?oauth_consumer_key=" + settings.EVERNOTE_AUTH_KEY + "&oauth_signature=" + settings.EVERNOTE_AUTH_SECRET +"&oauth_signature_method=PLAINTEXT&oauth_timestamp=1288364369&oauth_nonce=d3d9446802a44259&oauth_callback=http%3A%2F%2F" + request.get_host() + "%2Fevernote-access-token%2F%3Faction%3DoauthCallback%3Fproject%3D"+project_id
        temporary_credentials = urllib2.urlopen(url_evernote).read()
        return redirect("https://sandbox.evernote.com/OAuth.action?" + temporary_credentials)

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

def get_evernote_access_token(request):
    if request.method == "GET":
        user_profile = UserProfile.objects.get(user = request.user)

        access_token = request.GET.get("oauth_token")
        oauth_verifier = request.GET.get("oauth_verifier")

        token_credentials = urllib2.urlopen("https://sandbox.evernote.com/oauth?oauth_consumer_key=" + settings.EVERNOTE_AUTH_KEY + "&oauth_signature=" + settings.EVERNOTE_AUTH_SECRET +"&oauth_signature_method=PLAINTEXT&oauth_timestamp=1288364369&oauth_nonce=d3d9446802a44259&oauth_token=" + access_token + "&oauth_verifier=" + oauth_verifier).read()
        token_credentials = urllib2.unquote(token_credentials)
        list_answer = token_credentials.split('&')

        project_id = request.GET.get('action').split('?')[1].split('=')[1]
        dict_answer = cgi.parse_qs(token_credentials)
        user_profile.evernote_profile.auth_token = dict_answer['oauth_token'].pop()
        #user_profile.evernote_profile.secret_auth_token = dict_answer['oauth_token_secret'].pop()
        user_profile.evernote_profile.edam_shard = dict_answer['edam_shard'].pop()
        user_profile.evernote_profile.edam_userid = dict_answer['edam_userId'].pop()
        user_profile.evernote_profile.edam_expires = dict_answer['edam_expires'].pop()
        user_profile.evernote_profile.notebook_url = dict_answer['edam_noteStoreUrl'].pop()

        user_profile.is_evernote_synced = True
        user_profile.save()
        return redirect("/project/{0}/notes/".format(project_id))

def get_dropbox_access_token(request):
    if request.method == "GET":
        user_profile = UserProfile.objects.get(user = request.user)
        request_token = user_profile.dropbox_profile.request_token
        sess = session.DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type= settings.DROPBOX_ACCESS_TYPE)
        request_token = session.OAuthToken(request_token['key'], request_token['secret'])
        access_token = sess.obtain_access_token(request_token)

        user_profile.dropbox_profile.access_token = { "key" : access_token.key, "secret": access_token.secret}
        user_profile.is_dropbox_synced = True
        user_profile.save()

        #Create project folder
        sess = DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type=settings.DROPBOX_ACCESS_TYPE)
        sess.set_token(user_profile.dropbox_profile.access_token['key'], user_profile.dropbox_profile.access_token['secret'])
        api_client = client.DropboxClient(sess)

        projects = Project.objects.filter(pk__in=user_profile.projects)
        for p in projects:
            api_client.file_create_folder(p.title)
        return redirect("/project/{0}/files/".format(request.GET.get('project_id')))

def upload_dropbox_file(request):
    if request.method == 'POST':
        user_profile = UserProfile.objects.get(user = request.user)
        sess = session.DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type=settings.DROPBOX_ACCESS_TYPE)
        sess.set_token(user_profile.dropbox_profile.access_token['key'], user_profile.dropbox_profile.access_token['secret'])
        drop_client = client.DropboxClient(sess)

        file = request.FILES['file']
        folder = Project.objects.get(id=request.POST['project_id']).title
        result = drop_client.put_file('/' + folder + '/' + file.name, file.file)

        dest_path = result['path']

        return redirect("/project/{0}/files/".format(request.POST.get('project_id')))

def multiuploader(request):
    """
    Main Multiuploader module.
    Parses data from jQuery plugin and makes database changes.
    """
    if request.method == 'POST':

        user_profile = UserProfile.objects.get(user = request.user)
        sess = session.DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type=settings.DROPBOX_ACCESS_TYPE)
        sess.set_token(user_profile.dropbox_profile.access_token['key'], user_profile.dropbox_profile.access_token['secret'])
        drop_client = client.DropboxClient(sess)

        file = request.FILES[u'files[]']
        #folder = Project.objects.get(id=request.POST['project_id']).title
        folder = 'Brr'
        result = drop_client.put_file('/' + folder + '/' + file.name, file.file)


        #if request.FILES == None:
        #    return HttpResponseBadRequest('Must have files attached!')

        #getting file data for farther manipulations
        """file = request.FILES[u'files[]']
        wrapped_file = UploadedFile(file)
        filename = wrapped_file.name
        file_size = wrapped_file.file.size

        #writing file manually into model
        #because we don't need form of any type.
        image = MultiuploaderImage()
        image.filename=str(filename)
        image.image=file
        image.key_data = image.key_generate
        image.save()

        #getting thumbnail url using sorl-thumbnail
        if 'image' in file.content_type.lower():
            im = get_thumbnail(image, "80x80", quality=50)
            thumb_url = im.url
        else:
            thumb_url = ''

        #settings imports
        try:
            file_delete_url = settings.MULTI_FILE_DELETE_URL+'/'
            file_url = settings.MULTI_IMAGE_URL+'/'+image.key_data+'/'
        except AttributeError:
            file_delete_url = 'multi_delete/'
            file_url = 'multi_image/'+image.key_data+'/'"""

        #generating json response array
        result = []
        """result.append({"name":filename, 
                       "size":file_size, 
                       "url":file_url,
                       "delete_url":file_delete_url+str(image.pk)+'/', 
                       "delete_type":"POST",})"""
        result.append({"files": [
          {
            "name": "picture1.jpg",
            "size": 902604,
            "url": "http:\/\/example.org\/files\/picture1.jpg",
            "thumbnail_url": "http:\/\/example.org\/files\/thumbnail\/picture1.jpg",
            "delete_url": "http:\/\/example.org\/files\/picture1.jpg",
            "delete_type": "DELETE"
          },
          {
            "name": "picture2.jpg",
            "size": 841946,
            "url": "http:\/\/example.org\/files\/picture2.jpg",
            "thumbnail_url": "http:\/\/example.org\/files\/thumbnail\/picture2.jpg",
            "delete_url": "http:\/\/example.org\/files\/picture2.jpg",
            "delete_type": "DELETE"
          }
        ]})
        response_data = simplejson.dumps(result)
        
        #checking for json data type
        #big thanks to Guy Shapiro
        if "application/json" in request.META['HTTP_ACCEPT_ENCODING']:
            mimetype = 'application/json'
        else:
            mimetype = 'text/plain'
        return HttpResponse(response_data, mimetype=mimetype)
    else: #GET
        return HttpResponse('Only POST accepted')

def get_evernote_image(request):
    if request.method == 'GET':
        user_profile = UserProfile.objects.get(user = request.user)
        ev_h = EvernoteHelper(user_profile.evernote_profile)

        import binascii
        resource = ev_h.note_store.getResourceByHash(user_profile.evernote_profile.auth_token, request.GET.get('note-guid'),binascii.unhexlify(request.GET.get('hash')), True, False, False)

        res = _setCacheHeaders(resource.data.body,resource.mime)
        return res

def get_evernote_thumbnail(request):
    if request.method == 'GET':
        user_profile = UserProfile.objects.get(user = request.user)

        evernote_url = 'https://sandbox.evernote.com/shard/s1/thm/note/'
        evernote_guid = request.GET.get('evernote-guid')
        data = dict(auth = user_profile.evernote_profile.auth_token)

        req = urllib2.Request(evernote_url + evernote_guid)
        req = urllib2.urlopen(req, data=urlencode(data))
        thum = req.read()

        res = _setCacheHeaders(thum,req.headers.type)
        return res

def get_dropbox_file(request):
    if request.method == 'GET':

        user_profile = UserProfile.objects.get(user = request.user)
        sess = session.DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type=settings.DROPBOX_ACCESS_TYPE)
        sess.set_token(user_profile.dropbox_profile.access_token['key'], user_profile.dropbox_profile.access_token['secret'])
        drop_client = client.DropboxClient(sess)

        res = drop_client.media(request.GET.get('path'))
        req = urllib2.urlopen(res[u'url'])
        file = req.read()
        res = _setCacheHeaders(file,req.headers.type)
        return res

def get_dropbox_share(request):
    if request.method == 'GET':

        user_profile = UserProfile.objects.get(user = request.user)
        sess = session.DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type=settings.DROPBOX_ACCESS_TYPE)
        sess.set_token(user_profile.dropbox_profile.access_token['key'], user_profile.dropbox_profile.access_token['secret'])
        drop_client = client.DropboxClient(sess)

        res = drop_client.share(request.GET.get('path'))
        return redirect(res[u'url'])

def _setCacheHeaders(body, type):
    res = HttpResponse()
    current_time = datetime.datetime.utcnow()
    last_modified = current_time - datetime.timedelta(days=1)
    res['Content-Type'] = type
    res['Last-Modified'] = last_modified.strftime('%a, %d %b %Y %H:%M:%S GMT')
    res['Expires'] = current_time + datetime.timedelta(days=30)
    res['Cache-Control']  = 'public, max-age=315360000'
    res['Date']           = current_time
    res.content = body
    return res