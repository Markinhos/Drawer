from drawapp.drawerApp.models import Task, Project, UserProfile, Note, FileMetadata, Comment, Invitation
from drawapp.drawerApp.modelforms import ProjectForm, TaskForm, NoteForm, FileMetadataForm, CommentForm
from tastypie.authorization import Authorization
from tastypie import fields, utils, http
from tastypie.paginator import Paginator
from tastypie.authorization import DjangoAuthorization
from tastypie.authentication import BasicAuthentication, Authentication
from datetime import datetime
from tastypie.validation import FormValidation
from django.contrib.auth.models import User
from drawapp.tastypie_nonrel.resources import MongoResource, MongoListResource
from drawapp.tastypie_nonrel.fields import EmbeddedCollection, ListField, DictField
from drawerApp.utils import EvernoteHelper
from bson.objectid import ObjectId
from dropbox.session import DropboxSession
from django.conf import settings
from dropbox import session, client
from django.core.exceptions import PermissionDenied
from tastypie.exceptions import ImmediateHttpResponse
from tastypie.http import HttpNotFound
from tastypie.cache import SimpleCache

class UserResource(MongoResource):

    class Meta:
        queryset            =   User.objects.all()
        resource_name       =   'user'
        #cache               =   SimpleCache()

class InvitationResource(MongoListResource):
    project = fields.ForeignKey('drawapp.drawerApp.resources.ProjectResource', 'project', full=False)
    receiver = fields.CharField()

    class Meta:
        queryset = Invitation.objects.all()
        resource_name = 'invitation'
        authorization = Authorization()

    def obj_create(self, bundle, request=None, **kwargs):
        #find user
        if User.objects.filter(email=bundle.data["receiver"]).exists():
            user_receiver = User.objects.get(email=bundle.data["receiver"])
            user_profile_receiver = UserProfile.objects.get(user=user_receiver)
            project_shared = Project.objects.get(id=ObjectId(bundle.data["project_id"]))
            project_shared.members.append(user_profile_receiver.id)
            project_shared.save()
            user_profile_receiver.projects.append(project_shared.id)
            user_profile_receiver.save()
            return super(InvitationResource,self).obj_create(bundle, request, **kwargs)
        else:
            raise ImmediateHttpResponse(HttpNotFound('No email was found'))

class UserProfileResource(MongoResource):
    user = fields.ForeignKey(UserResource, 'user', full=True)
    invitations = EmbeddedCollection(of='drawapp.drawerApp.resources.InvitationResource', attribute='invitations', null=True, blank= True, full='True')
    class Meta:
        queryset            =   UserProfile.objects.all()
        resource_name       =   'userProfile'
        authorization       =   Authorization()
        excludes            =   ['dropbox_profile', 'evernote_profile']
        #cache               =   SimpleCache()

class CommentCollectionResource(MongoListResource):
    owner = fields.ForeignKey(UserResource, 'owner')
    owner_name = fields.CharField(readonly=True)
    comments = EmbeddedCollection(of = 'drawapp.drawerApp.resources.CommentCollectionResource', attribute = 'comments', null=True, blank=True, full=True)
    tasks_ids = ListField(attribute='tasks_ids', null=True, blank=True)
    notes_ids = ListField(attribute='notes_ids', null=True, blank=True)
    modified = fields.DateTimeField(attribute='modified', null=True, blank=True)
    created = fields.DateTimeField(attribute='created', null=True, blank=True)
    custom_id = fields.CharField(readonly=True)
    dataResponse = DictField()

    class Meta:
        object_class        =   Comment
        queryset            =   Comment.objects.all()
        resource_name       =   'project'
        authorization       =   Authorization()
        ordering            =   ['modified', 'created']
        #cache               =   SimpleCache()

    def dehydrate_owner_name(self, bundle):
        return bundle.obj.owner.username

    def dehydrate_custom_id(self, bundle):
        if hasattr(bundle.obj, 'parent'):
            return str(bundle.obj.parent.id) + str(bundle.obj.id)
        else:
            return str(bundle.obj.id)

    def hydrate_modified(self, bundle):
        #TO-DO created date can be tampered
        bundle.data['modified'] = datetime.now().isoformat()
        return bundle

    def dehydrate_dataResponse(self, bundle):
        return bundle.obj.dataResponse
        
    def hydrate_dataResponse(self, bundle):
        if 'dataResponse' in bundle.data:
            d = bundle.data['dataResponse']
        return bundle

    """def hydrate_tasks_ids(self, bundle):
        #Hack to remove project
        if 'tasks_ids' in bundle.data and bundle.data['tasks_ids'] is not None:
            for t in bundle.data['tasks_ids']:
                if t['project'] is not None:
                    del(t['project'])
        return bundle"""

    def hydrate_comments(self, bundle):
        if 'comments' in bundle.data and len(bundle.data['comments']) > 0 and 'id' not in bundle.data['comments'][-1]:
            import copy
            bundle_copy = copy.deepcopy(bundle)
            #self.full_dehydrate(bundle_copy)
            #[i.data for i in self.fields['comments'].dehydrate(bundle_copy)].append(bundle.data['comments'][-1])
            #bundle_copy.data['comments'].append(bundle.data['comments'][-1])
            comments_saved = [i.data for i in self.fields['comments'].dehydrate(bundle_copy)]
            comments_saved.append(bundle.data['comments'][-1])
            bundle.data['comments'] = comments_saved
        return bundle

    def obj_create(self, bundle, request=None, **kwargs):
        bundle.data['created'] = datetime.now().isoformat()
        bundle = super(CommentCollectionResource, self).obj_create(bundle,request, **kwargs)
        return bundle


class FileMetadataCollectionResource(MongoListResource):
    created = fields.DateTimeField(default = datetime.now)
    comments = EmbeddedCollection(of = CommentCollectionResource, attribute = 'comments', null=True, blank=True, full=True)
    filename = fields.CharField(readonly=True)
    class Meta:
        object_class        =   FileMetadata
        queryset            =   FileMetadata.objects.all()
        resource_name       =   'fileMetadata'
        authorization       =   Authorization()
        validation          =   FormValidation(form_class=FileMetadataForm)
        #cache               =   SimpleCache()

    def dehydrate_filename(self, bundle):
        path = bundle.obj.path
        return path[path.rfind('/') + 1:]

    def obj_get_list(self, request=None, **kwargs):
        user_profile = UserProfile.objects.get(user = request.user)
        if user_profile.is_dropbox_synced:
            project = Project.objects.get(pk = self.instance.pk)
            FileMetadata.get_synced_files(user_profile, project)
            self.instance.files = project.files
        return super(FileMetadataCollectionResource, self).obj_get_list(request, **kwargs)

    def obj_delete(self, request=None, **kwargs):
        #Check if evernote accout is set up
        user_profile = UserProfile.objects.get(user = request.user)
        if user_profile.is_dropbox_synced:
            self.instance.files[int(kwargs['index'])].delete_file_dropbox(user_profile)
        return super(FileMetadataCollectionResource, self).obj_delete(request, **kwargs)

class TaskCollectionResource(MongoListResource):
    created = fields.DateTimeField(default = datetime.now, null=True, blank=True)
    modified = fields.DateTimeField(default = datetime.now)
    comments = EmbeddedCollection(of = CommentCollectionResource, attribute = 'comments', null=True, blank=True, full=True)
    creator = fields.ForeignKey(UserResource, 'creator')
    creator_name = fields.CharField(readonly=True)
    duedate = fields.DateTimeField(attribute='duedate', null=True,blank=True)

    class Meta:
        object_class        =   Task
        queryset            =   Task.objects.all()
        resource_name       =   'task'
        authorization       =   Authorization()
        validation          =   FormValidation(form_class=TaskForm)
        #cache               =   SimpleCache()

    def dehydrate_creator_name(self, bundle):
        return bundle.obj.creator.username

    def obj_delete(self, request=None, **kwargs):
        result = super(TaskCollectionResource, self).obj_delete(request, **kwargs)

        #statuses with a link to the task to be deleted
        statuses = [i for i  in self.instance.statuses if request.path in i.tasks_ids]
        for s in statuses:
            s.tasks_ids.remove(request.path)

        #and now updates all the tasks links within the project statuses :(
        for s in self.instance.statuses:
            for n in s.tasks_ids:
                splitted = n.split('/')
                if splitted[-2] > kwargs['index']:
                    splitted[-2] = str(int(splitted[-2]) - 1)
                    index = s.tasks_ids.index(n)
                    n = '/'.join(splitted)
                    s.tasks_ids[index] = n
        self.instance.save()
        return result

class NoteCollectionResource(MongoListResource):
    title = fields.CharField(attribute= 'title', default='', blank = True)
    evernote_usn = fields.IntegerField(default=0, blank=True, null=True)
    evernote_guid = fields.CharField(null=True, blank=True)
    modified = fields.DateTimeField(attribute='modified', null=True, blank=True)
    created = fields.DateTimeField(attribute='created', null=True, blank=True)
    #snipett = fields.CharField(readonly=True)
    comments = EmbeddedCollection(of = CommentCollectionResource, attribute = 'comments', null=True, blank=True, full=True)

    class Meta:
        object_class        =   Note
        queryset            =   Note.objects.all()
        resource_name       =   'note'
        authorization       =   Authorization()
        validation          =   FormValidation(form_class=NoteForm)
        excludes            =   ['resources']
        ordering            =   ['modified']
        #cache               =   SimpleCache()


    def hydrate_content(self, bundle):
        bundle.data['content'] = bundle.data['content'].replace('<br>', '<br />')
        return bundle

    def hydrate_modified(self, bundle):
        #TO-DO created date can be tampered
        bundle.data['modified'] = datetime.now().isoformat()
        return bundle

    def dehydrate_evernote_guid(self, bundle):
        return bundle.obj.evernote_guid

    def dehydrate_content(self, bundle):
        if hasattr(bundle.request, 'user'):

            user_profile = UserProfile.objects.get(user = bundle.request.user)

            if user_profile.is_evernote_synced:
                ev_h = EvernoteHelper(user_profile.evernote_profile)

                return ev_h.replace_images(bundle.obj.content, bundle.obj.evernote_guid)
            else:
                return bundle.obj.content

    def obj_create(self, bundle, request=None, **kwargs):
        bundle.data['created'] = datetime.now().isoformat()
        bundle = super(NoteCollectionResource, self).obj_create(bundle,request, **kwargs)
        #Check if evernote accout is set up
        user_profile = UserProfile.objects.get(user = request.user)
        if user_profile.is_evernote_synced:
            project = Project.objects.get(pk = self.instance.pk)
            self.instance.notes[int(bundle.obj.id)].create_note_evernote(user_profile, project)
        return bundle

    def obj_delete(self, request=None, **kwargs):
        #Check if evernote accout is set up
        user_profile = UserProfile.objects.get(user = request.user)
        if user_profile.is_evernote_synced:
            self.instance.notes[int(kwargs['index'])].delete_note_evernote(user_profile)
        result = super(NoteCollectionResource, self).obj_delete(request, **kwargs)

        #statuses with a link to the note to be deleted
        statuses = [i for i  in self.instance.statuses if request.path in i.notes_ids]
        for s in statuses:
            s.notes_ids.remove(request.path)

        #and now updates all the notes links within the project statuses :(
        for s in self.instance.statuses:
            for n in s.notes_ids:
                splitted = n.split('/')
                if splitted[-2] > kwargs['index']:
                    splitted[-2] = str(int(splitted[-2]) - 1)
                    index = s.notes_ids.index(n)
                    n = '/'.join(splitted)
                    s.notes_ids[index] = n
        self.instance.save()
        return result


    def get_list(self, request, **kwargs):
        user_profile = UserProfile.objects.get(user = request.user)
        if user_profile.is_evernote_synced:
            project = Project.objects.get(pk = self.instance.pk)
            Note.get_synced_notes(user_profile, project)
            self.instance.notes = project.notes
        return super(NoteCollectionResource, self).get_list(request, **kwargs)

class ProjectResource(MongoResource):
    user = fields.ForeignKey(UserResource, 'user')
    description = fields.CharField(null=True, blank=True)
    tasks = EmbeddedCollection(of = TaskCollectionResource, attribute = 'tasks', null=True, blank=True, full=True)
    notes = EmbeddedCollection(of = NoteCollectionResource, attribute = 'notes', null=True, blank=True, full=False)
    statuses = EmbeddedCollection(of = CommentCollectionResource, attribute = 'statuses', null=True, blank=True, full=False)
    files = EmbeddedCollection(of = FileMetadataCollectionResource, attribute = 'files', null=True, blank=True, full=True)
    created = fields.DateTimeField(default = datetime.now)

    class Meta:
        queryset            =    Project.objects.all()
        resource_name       =    'project'
        authorization       =    DjangoAuthorization()
        authentication      =    Authentication()
        allowed_methods     =    ['get', 'post', 'put', 'delete']
        validation          =    FormValidation(form_class=ProjectForm)
        #cache               =   SimpleCache()

    def obj_create(self, bundle, request=None, **kwargs):
        response =  super(ProjectResource, self).obj_create(bundle, request, **kwargs)
        user_profile = UserProfile.objects.get(user=request.user)
        if user_profile.is_dropbox_synced:
            sess = DropboxSession(settings.DROPBOX_AUTH_KEY, settings.DROPBOX_AUTH_SECRET, access_type=settings.DROPBOX_ACCESS_TYPE)
            sess.set_token(user_profile.dropbox_profile.access_token['key'], user_profile.dropbox_profile.access_token['secret'])
            api_client = client.DropboxClient(sess)
            api_client.file_create_folder(response.obj.title)
        return response
    def apply_authorization_limits(self, request, object_list):
        if request.user.is_active:
            user_profile = UserProfile.objects.get(user=request.user)
            object_list = Project.objects.filter(id__in=[ObjectId(x) for x in (set(user_profile.projects) & set(([p.id for p in object_list])))])
            return object_list
        else:
            raise PermissionDenied("Not authorized")

    def obj_delete(self, request=None, **kwargs):
        project = Project.objects.get(id=kwargs["pk"])
        user = User.objects.get(id=request.user.id)
        user_profile = UserProfile.objects.get(user=request.user)

        if len(project.members) > 1:
            project.members.remove(ObjectId(user.id))
            user_profile.projects.remove(ObjectId(project.id))
            user_profile.save()
            project.save()
            return http.HttpNoContent
        else:
            return super(ProjectResource, self).obj_delete(request, **kwargs)

    def get_list(self, request, **kwargs):
        return super(ProjectResource, self).get_list(request, **kwargs)

