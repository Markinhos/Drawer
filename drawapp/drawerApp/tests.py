from django.test import TestCase
from django.contrib.auth.models import User
from drawapp.drawerApp.models import Project, Task, Note, UserProfile
import slumber
from tastypie.serializers import Serializer
from drawerApp.models import EvernoteProfile

class ProjectResourceTest(TestCase):
    fixtures = ['data.json']
    def setUp(self):
        super(ProjectResourceTest, self).setUp()
        self.username = 'marcos'
        self.password = 'test'
        #self.user = User.objects.create_user(self.username, 'marcos@test.com', self.password)
        #self.api = slumber.API("http://localhost:5000/api/v1/", auth=(self.username, self.password))
        self.post_data = {
            'title': 'testTitle',
            'description': 'testDescription',
            'user' : '/api/v1/user/4ea9c4fdbb69337f8e000002/',
            'tasks': []
        }
        self.serializer = Serializer()

    def test_post_project(self):
        format = self.serializer.content_types.get('json')
        serialized_data = self.serializer.serialize(self.post_data, format='application/json')
        self.assertEqual(Project.objects.count(), 1)
        resp = self.client.post('/api/v1/project/', data = serialized_data, content_type='application/json')
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(Project.objects.count(), 2)


    def test_put_project(self):
        format = self.serializer.content_types.get('json')
        project_data = self.post_data
        project_data['title'] = 'changedTitle'
        serialized_data = self.serializer.serialize(project_data, format='application/json')
        resp = self.client.put('/api/v1/project/4ea9c4fdbb69337f8e000001/', data = serialized_data, content_type='application/json')
        self.assertEqual(resp.status_code, 204)
        resp = self.client.get('/api/v1/project/')
        self.assertEqual("changedTitle", self.serializer.deserialize(resp.content)['objects'][0]['title'])

    def test_get_projects(self):
        resp = self.client.get('/api/v1/project/')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp['Content-Type'].startswith('application/json'))
        self.serializer.from_json(resp.content)
        self.assertEqual(len(self.serializer.deserialize(resp.content)['objects']), 1)
        assert True

    """def test_get_tasks(self):
        resp = self.client.get('/api/v1/task/')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp['Content-Type'].startswith('application/json'))"""

#Notes tests
class NoteResourceTest(TestCase):
    fixtures = ['data.json']
    def setUp(self):
        super(NoteResourceTest, self).setUp()
        self.project_id = '4ea9c4fdbb69337f8e000001'
        self.project = Project.objects.get(pk= self.project_id)
        self.post_data = {
            'title': 'testTitle',
            'content': 'note content test',
        }
        self.serializer = Serializer()
        self.user = User.objects.create_user("marcos2", 'marcos2@test.com', "test")
        self.client.login(username = "marcos2", password = "test")
        self.evernote_profile = EvernoteProfile()
        self.user_profile = UserProfile(user = self.user, evernote_profile = self.evernote_profile)
        self.user_profile.save()

    def test_get_notes(self):
        resp = self.client.get('/api/v1/project/{0}/notes/'.format(self.project_id))
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp['Content-Type'].startswith('application/json'))

    def test_post_note(self):
        format = self.serializer.content_types.get('json')
        serialized_data = self.serializer.serialize(self.post_data, format='application/json')
        self.assertEqual(len(self.project.notes), 0)
        resp = self.client.post('/api/v1/project/{0}/notes/'.format(self.project_id), data = serialized_data, content_type='application/json' )
        self.project = Project.objects.get(pk= self.project_id)
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(len(self.project.notes), 1)

    def test_sync_evernote(self):
        note = Note(title = 'test note sync', content = 'test content sync')
        self.project.notes.append(note)
        self.project.save()
        createdNote = note.sync_note_evernote(self.user_profile.evernote_profile)
        self.assertTrue(createdNote is not None)
        self.assertTrue(createdNote.active)

    def test_get_synced_notes(self):
        Note.get_synced_notes(self.user_profile.evernote_profile)
        self.assertTrue(False)
