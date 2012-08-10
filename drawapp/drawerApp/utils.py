from exceptions import NotImplementedError
from evernote.edam.notestore import NoteStore
from evernote.edam.notestore.ttypes import NotesMetadataResultSpec
from evernote.edam.userstore import UserStore
from thrift.protocol import TBinaryProtocol
from thrift.transport import THttpClient
from django.conf import settings
import xml.dom as minidom
import evernote.edam.userstore.constants as UserStoreConstants
import evernote.edam.type.ttypes as Types
from lxml import etree as etree



class EvernoteHelper(object):
    EVERNOTE_HOST = "sandbox.evernote.com"
    def __init__(self, auth_token):
        self.auth_token = auth_token
        self._user_store = None
        self._note_store = None

    @property
    def current_state_count(self):
        currentState = self.note_store.getSyncState(self.auth_token)
        currentStateCount = currentState.updateCount
        return currentStateCount
    @property
    def user_store(self):
        if self._user_store is None:
            self._user_store = self._get_user_store()
        return self._user_store

    @property
    def note_store(self):
        if self._note_store is None:
            self._note_store = self._get_note_store()
        return self._note_store

    def _get_user_store(self):
        user_store_uri = "https://" + self.EVERNOTE_HOST + "/edam/user"
        user_store_http_client = THttpClient.THttpClient(user_store_uri)
        user_store_protocol = TBinaryProtocol.TBinaryProtocol(user_store_http_client)
        user_store = UserStore.Client(user_store_protocol)
        return user_store

    def _get_note_store(self):
        note_store_url = self.user_store.getNoteStoreUrl(self.auth_token)
        note_store_http_client = THttpClient.THttpClient(note_store_url)
        note_store_protocol = TBinaryProtocol.TBinaryProtocol(note_store_http_client)
        note_store = NoteStore.Client(note_store_protocol)
        return note_store

    def _check_version(self):
        versionOK = self._user_store.checkVersion("Evernote EDAMTest (Python)",
            UserStoreConstants.EDAM_VERSION_MAJOR,
            UserStoreConstants.EDAM_VERSION_MINOR)
        if versionOK:
            return True
        else:
            return False

    def get_notebook(self, evernote_profile):
        # List all of the notebooks in the user's account
        notebooks = self.note_store.listNotebooks(self.auth_token)

        notebook_create = Types.Notebook()
        notebook_create.name = settings.EVERNOTE_NOTEBOOK

        notfind = (n for n in notebooks)

        nb = next(notfind, None)
        while nb is not None:
            if (nb.guid == evernote_profile.notebook_guid) or (nb.name == settings.EVERNOTE_NOTEBOOK):
                notebook_create = nb
                nb = None
            else:
                nb = next(notfind, None)
        if notebook_create.guid is None:
            notebook_create = self._create_notebook(notebook_create)

        return notebook_create

    def _create_notebook(self, notebook):
        notebook_create = self.note_store.createNotebook(self.auth_token, notebook)
        return notebook_create

    def get_metadata_notes(self, evernote_profile):
        filter = NoteStore.NoteFilter()
        filter.notebookGuid = self.get_notebook(evernote_profile).guid
        rspec = NotesMetadataResultSpec()
        rspec.includeUpdateSequenceNum = True
        new_notes = self.note_store.findNotesMetadata(self.auth_token, filter , 0, 20, rspec)
        return new_notes

    def create_note(self, title, content):
    # To create a new note, simply create a new Note object and fill in
        # attributes such as the note's title.
        note = Types.Note()
        note.title = title if (title is not None) else ''

        # The content of an Evernote note is represented using Evernote Markup Language
        # (ENML). The full ENML specification can be found in the Evernote API Overview
        # at http://dev.evernote.com/documentation/cloud/chapters/ENML.php
        note.content = '<?xml version="1.0" encoding="UTF-8"?>'
        note.content += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">'
        note.content += '<en-note>'+ content +'<br/>'
        note.content += '</en-note>'

        # Finally, send the new note to Evernote using the createNote method
        # The new Note object that is returned will contain server-generated
        # attributes such as the new note's unique GUID.
        note.notebookGuid = self.evernote_profile.guid

        return note

    def is_account_synced(self):
        if self.current_state_count > self.evernote_profile.latest_update_count:
            return False
        else:
            return True

    def copy_evernote_note(self, evernote_note, local_note):
        local_note.title = evernote_note.title
        tree = etree.fromstring(evernote_note.content)
        content, snipett = "", ""
        snipett_list = tree.xpath('//text()')
        for chunk in snipett_list:
            snipett += chunk + " "
        for chunk in list(tree):
            content += etree.tostring(chunk)
        local_note.content = content
        local_note.snipett = snipett.strip()
        local_note.evernote_guid = evernote_note.guid
        local_note.evernote_usn = evernote_note.updateSequenceNum
        return local_note