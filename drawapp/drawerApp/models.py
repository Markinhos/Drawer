from django.db import models
from djangotoolbox.fields import ListField, EmbeddedModelField
from django.contrib.auth.models import User
from drawapp.drawerApp.forms import EmbeddedModelListFormField
import sys
import hashlib
import binascii
import time
import thrift.protocol.TBinaryProtocol as TBinaryProtocol
import thrift.transport.THttpClient as THttpClient
import evernote.edam.userstore.UserStore as UserStore
import evernote.edam.userstore.constants as UserStoreConstants
import evernote.edam.notestore.NoteStore as NoteStore
import evernote.edam.type.ttypes as Types
import evernote.edam.error.ttypes as Errors

class EmbeddedModelListField(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, EmbeddedModelListFormField, **kwargs)

class UserProfile(models.Model):
    user = models.OneToOneField(User)
    isEvernoteSynced = models.BooleanField()


class Task(models.Model):
    STATUS = ['DONE', 'TODO']
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=50, choices=[(item, item) for item in STATUS])
    created_date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.title

class Note(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(max_length=5000)
    created_date = models.DateTimeField(auto_now_add=True)

    def save(self):
        super(Note, self).save()
        self.sync_note_evernote(self.content)
    def sync_note_evernote(self, content=''):
        # Real applications authenticate with Evernote using OAuth, but for the
        # purpose of exploring the API, you can get a developer token that allows
        # you to access your own Evernote account. To get a developer token, visit
        # https://sandbox.evernote.com/api/DeveloperToken.action
        authToken = "S=s1:U=2b020:E=1402f30e366:C=138d77fb766:P=1cd:A=en-devtoken:H=6d184bd37dbf135150efeba02c89ebb3"

        if authToken == "your developer token":
            print "Please fill in your developer token"
            print "To get a developer token, visit https://sandbox.evernote.com/api/DeveloperToken.action"
            return None

        # Initial development is performed on our sandbox server. To use the production
        # service, change "sandbox.evernote.com" to "www.evernote.com" and replace your
        # developer token above with a token from
        # https://www.evernote.com/api/DeveloperToken.action
        evernoteHost = "sandbox.evernote.com"
        userStoreUri = "https://" + evernoteHost + "/edam/user"

        userStoreHttpClient = THttpClient.THttpClient(userStoreUri)
        userStoreProtocol = TBinaryProtocol.TBinaryProtocol(userStoreHttpClient)
        userStore = UserStore.Client(userStoreProtocol)

        versionOK = userStore.checkVersion("Evernote EDAMTest (Python)",
            UserStoreConstants.EDAM_VERSION_MAJOR,
            UserStoreConstants.EDAM_VERSION_MINOR)
        print "Is my Evernote API version up to date? ", str(versionOK)
        print ""
        if not versionOK:
            return None

        # Get the URL used to interact with the contents of the user's account
        # When your application authenticates using OAuth, the NoteStore URL will
        # be returned along with the auth token in the final OAuth request.
        # In that case, you don't need to make this call.
        noteStoreUrl = userStore.getNoteStoreUrl(authToken)

        noteStoreHttpClient = THttpClient.THttpClient(noteStoreUrl)
        noteStoreProtocol = TBinaryProtocol.TBinaryProtocol(noteStoreHttpClient)
        noteStore = NoteStore.Client(noteStoreProtocol)

        # List all of the notebooks in the user's account
        notebooks = noteStore.listNotebooks(authToken)
        print "Found ", len(notebooks), " notebooks:"
        for notebook in notebooks:
            print "  * ", notebook.name

        # To create a new note, simply create a new Note object and fill in
        # attributes such as the note's title.
        note = Types.Note()
        note.title = self.title

        # The content of an Evernote note is represented using Evernote Markup Language
        # (ENML). The full ENML specification can be found in the Evernote API Overview
        # at http://dev.evernote.com/documentation/cloud/chapters/ENML.php
        note.content = '<?xml version="1.0" encoding="UTF-8"?>'
        note.content += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">'
        note.content += '<en-note>'+ self.content +'<br/>'
        note.content += '</en-note>'

        # Finally, send the new note to Evernote using the createNote method
        # The new Note object that is returned will contain server-generated
        # attributes such as the new note's unique GUID.
        createdNote = noteStore.createNote(authToken, note)
        return createdNote
    def __unicode__(self):
        return self.title

class Project(models.Model):
    user = models.ForeignKey(User)
    tasks = EmbeddedModelListField(EmbeddedModelField('Task'), null=True, blank=True)
    notes = EmbeddedModelListField(EmbeddedModelField('Note'), null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=5000)
    pub_date = models.DateTimeField(auto_now_add=True)
    def save(self):
        super(Project, self).save()

