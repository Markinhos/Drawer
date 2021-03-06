# Django settings for Drawer project.
import os

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))

DEBUG = False  
TEMPLATE_DEBUG = DEBUG

ADMINS = (
# ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

import re


mongolab_uri = os.environ.get('MONGOLAB_URI')

if mongolab_uri:

  import re

  sp = re.findall(r"[\w\.]+", mongolab_uri)

  DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_engine', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': sp[1],                      # Or path to database file if using sqlite3.
        'USER': sp[5],
        'PASSWORD': sp[2],
        'HOST': sp[3],
        'PORT': sp[4],
        'SUPPORTS_TRANSACTIONS': False,
    },
  }
# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'Europe/Madrid'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = u'4facf6561d41c81134000000'            

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = '/home/marcos/testUpload/'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = ''

TASTYPIE_CANNED_ERROR = "Oops, we broke it!"

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = '/home/marcos/statictests/'

# URL prefix for admin static files -- CSS, JavaScript and images.
# Make sure to use a trailing slash.
# Examples: "http://foo.com/static/admin/", "/static/admin/".
ADMIN_MEDIA_PREFIX = '/static/admin/'

STATICFILES_STORAGE = 'pipeline.storage.PipelineStorage'

HOST_PROTOCOL = 'https://'
HOSTNAME = 'simpledesk.herokuapp.com'

try:
    from local_settings import *
except ImportError:
    pass

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
if not DEBUG:
    STATIC_URL = 'http://s3-eu-west-1.amazonaws.com/boards2013/'
else:
    STATIC_URL = '/static/'
    
PIPELINE = not DEBUG

PIPELINE_JS = {
    'scripts_c': {
        'source_filenames': (
          #'js/libs/Backbone.js',
          'js/libs/backbone-tastypie.js',
          #'js/libs/backbone-relational.js',
          'js/libs/bootstrap-wysihtml5.js',
          'js/libs/bootstrap-timepicker.js',
          'js/libs/jquery.iframe-transport.js',          
          'js/libs/vendor/jquery.ui.widget.js', 
          'js/libs/jquery.fileupload*.js',          
          'js/libs/masonry.min.js',
          #'template/js/*.js',
          'fancybox/lib/jquery.mousewheel-3.0.6.pack.js',
          'fancybox/source/jquery.fancybox.pack.js',
          'fancybox/source/helpers/jquery.fancybox-media.js',
          'js/models/*.js',
          'js/collections/pollingCollection.js',          
          'js/collections/paginatedCollection.js',          
          'js/collections/*.js',          
          'js/views/shared/*.js',

          'js/views/status/add.js',
          'js/views/status/context.js',
          'js/views/status/list.js',
          'js/views/status/detail.js',
          'js/views/status/detailOverview.js',

          'js/views/*/add.js',
          'js/views/*/addContext.js',
          'js/views/*/list.js',
          'js/views/*/edit.js',
          'js/views/*/detail.js',
          'js/views/*/detailContext.js',
          'js/views/*/detailOverview.js',
          'js/views/composite/*.js',
          'js/router.js',
          'js/app.js',
        ),
        'output_filename': 'js/scripts_compressed.js',
    }
}

PIPELINE_CSS = {
    'styles_c': {
        'source_filenames': (
          #'template/css/*.css',
          'bootstrap/css/bootstrap.css',
          'css/*.css',
          'fancybox/source/jquery.fancybox.css',
        ),
        'output_filename': 'css/styles_compressed.css',
        'extra_context': {
            'media': 'screen',
        },
    },
}

PIPELINE_TEMPLATE_EXT = '.mustache'

# Additional locations of static files
STATICFILES_DIRS = (
# Put strings here, like "/home/html/static" or "C:/www/django/static".
# Always use forward slashes, even on Windows.
# Don't forget to use absolute paths, not relative paths.
    os.path.join(PROJECT_ROOT, 'static/'),    
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'staticfiles.finders.FileSystemFinder',
    'staticfiles.finders.AppDirectoriesFinder',
    #    'django.contrib.staticfiles.finders.DefaultStorageFinder',
    )

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'iib#fo63i%pqjqj2687-5te*0@+j__jl8wqx4vny@nx3-$au+i'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    #     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.gzip.GZipMiddleware',
)

AUTHENTICATION_BACKENDS = (
    'permission_backend_nonrel.backends.NonrelPermissionBackend',
)


ROOT_URLCONF = 'drawapp.urls'

LOGIN_URL = '/'

LOGIN_REDIRECT_URL = '/'

AUTH_PROFILE_MODULE = 'drawapp.UserProfile'

TEMPLATE_DIRS = (
# Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
# Always use forward slashes, even on Windows.
# Don't forget to use absolute paths, not relative paths.
    os.path.join(PROJECT_ROOT, 'templates')
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'staticfiles',
    'gunicorn',
    'django.contrib.admin',
    'djangotoolbox',
    'permission_backend_nonrel',
    'django_mongodb_engine',
    'tastypie',
    'django_extensions',
    'drawerApp',
    'pipeline'
    #'storages'
)


# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
            },
        }
}

EVERNOTE_NOTEBOOK = '@SimpleDesk'

EVERNOTE_AUTH_KEY = 'markinhosx-3585'

EVERNOTE_AUTH_SECRET = '4f1c060363a8f790'


DROPBOX_AUTH_KEY = 'tcpxyrxgx50vyso'

DROPBOX_AUTH_SECRET = 'ud3yedrc1dc1ghv'

DROPBOX_ACCESS_TYPE = 'dropbox'

APP_NAME = 'SimpleDesk'

def get_cache():
  import os
  try:
    os.environ['MEMCACHE_SERVERS'] = os.environ['MEMCACHIER_SERVERS']
    os.environ['MEMCACHE_USERNAME'] = os.environ['MEMCACHIER_USERNAME']
    os.environ['MEMCACHE_PASSWORD'] = os.environ['MEMCACHIER_PASSWORD']
    return {
      'default': {
        'BACKEND': 'django_pylibmc.memcached.PyLibMCCache',
        'LOCATION': os.environ['MEMCACHIER_SERVERS'],
        'TIMEOUT': 500,
        'BINARY': True,
      }
    }
  except:
    return {
      'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'
      }
    }

CACHES = get_cache()

CACHE_BACKEND = CACHES
