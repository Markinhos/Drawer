from exceptions import NotImplementedError
from evernote.edam.notestore import NoteStore
from evernote.edam.notestore.ttypes import NotesMetadataResultSpec
from evernote.edam.userstore import UserStore
from thrift.protocol import TBinaryProtocol
from thrift.transport import THttpClient
from django.conf import settings
import evernote.edam.userstore.constants as UserStoreConstants
import evernote.edam.type.ttypes as Types
from lxml import etree as etree
from xml.sax.saxutils import escape
import binascii

class EvernoteHelper(object):
    EVERNOTE_HOST = "www.evernote.com"
    def __init__(self, evernote_profile):
        self.auth_token = evernote_profile.auth_token
        self.evernote_profile = evernote_profile
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
        #note_store_url = self.user_store.getNoteStoreUrl(self.auth_token)
        note_store_url= self.evernote_profile.notebook_url
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

    def get_notebook(self, evernote_profile, project):
        # List all of the notebooks in the user's account
        notebooks = self.note_store.listNotebooks(self.auth_token)

        notebook_create = Types.Notebook()
        notebook_create.stack = settings.EVERNOTE_NOTEBOOK
        notebook_create.name = project.title

        notfind = (n for n in notebooks)

        nb = next(notfind, None)
        while nb is not None:
            if (nb.guid == evernote_profile.notebook_guid) or (nb.name == project.title):
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

    def get_metadata_notes(self, evernote_profile, project):
        filter = NoteStore.NoteFilter()
        filter.notebookGuid = self.get_notebook(evernote_profile, project).guid
        rspec = NotesMetadataResultSpec()
        rspec.includeUpdateSequenceNum = True
        new_notes = self.note_store.findNotesMetadata(self.auth_token, filter , 0, 20, rspec)
        return new_notes

    def create_note(self, title, content, project):
    # To create a new note, simply create a new Note object and fill in
        # attributes such as the note's title.
        note = Types.Note()
        note.title = title if (title is not None and len(title)  > 0) else 'No title'

        # The content of an Evernote note is represented using Evernote Markup Language
        # (ENML). The full ENML specification can be found in the Evernote API Overview
        # at http://dev.evernote.com/documentation/cloud/chapters/ENML.php
        note.content = '<?xml version="1.0" encoding="UTF-8"?>'
        note.content += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">'
        note.content += content +'<br/>'

        # Finally, send the new note to Evernote using the createNote method
        # The new Note object that is returned will contain server-generated
        # attributes such as the new note's unique GUID.
        note.notebookGuid = self.get_notebook(self.evernote_profile, project).guid

        return note

    def is_account_synced(self):
        if self.current_state_count > self.evernote_profile.latest_update_count:
            return False
        else:
            return True

    def copy_evernote_note(self, evernote_note, local_note):
        local_note.title = evernote_note.title
        tree = etree.fromstring(evernote_note.content)
        local_note.content = etree.tostring(tree.xpath("//en-note")[0])
        for r in evernote_note.resources:
            local_note.resources[binascii.hexlify(r.data.bodyHash)] = r.guid
        local_note.evernote_guid = evernote_note.guid
        local_note.evernote_usn = evernote_note.updateSequenceNum
        return local_note

    @classmethod
    def create_snipett(cls, content):
        snipett = ""
        try:
            tree = etree.fromstring(content)
        except:
            tree = etree.fromstring('<div>' + content + '</div>')
        snipett_list = tree.xpath('//text()')
        for chunk in list(snipett_list):
            snipett += chunk + " "
        return snipett.strip()

    def replace_images(self, content, note_guid):
        tree = etree.fromstring(content)
        images = tree.xpath('/en-note//en-media')
        for image in images:
            image_type = image.attrib['type']
            if image_type[:image_type.find("/")] == "image":
                stringified_att = ''
                attributes = image.attrib
                for att_key, att_value in attributes.items():
                    stringified_att += att_key + '="' + att_value + '" '
                #host = self.evernote_profile.notebook_url.replace("notestore", "res") + "/" + image.attrib['hash'] + "." + image_type[image_type.find("/") + 1:] + '?resizeSmall"'
                host = "/get-evernote-image/?hash=" + image.attrib['hash'] + "&note-guid=" + note_guid
                image_node = '<img ' + stringified_att + ' ' + 'src="' + escape(host) + '" ></img>'
                image_elem = etree.fromstring(image_node)
                image.getparent().insert(image.getparent().index(image),image_elem)
                image.getparent().remove(image)

        return etree.tostring(tree.xpath('/en-note')[0])
