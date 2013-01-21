# Django settings for Drawer project.
import os

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
# ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_engine', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'heroku_app5558288',                      # Or path to database file if using sqlite3.
        'USER': 'heroku_app5558288',
        'PASSWORD': 'ret24bau7j83dhpou08jsqni7v',
        'HOST': 'ds033907.mongolab.com',
        'PORT': 33907,
        'SUPPORTS_TRANSACTIONS': False,
    },
}
"""DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_engine', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'app5558288',                      # Or path to database file if using sqlite3.
        'USER': 'heroku',
        'PASSWORD': '647aeb87f87fd0a2ba2437619dc13222',
        'HOST': 'linus.mongohq.com',
        'PORT': 10087,
        'SUPPORTS_TRANSACTIONS': False,
    },
}"""

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
MEDIA_ROOT = ''

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

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
if not DEBUG:
    STATIC_URL = 'http://d3g4axnvhzewfv.cloudfront.net/'
else:
    STATIC_URL = '/static/'

# URL prefix for admin static files -- CSS, JavaScript and images.
# Make sure to use a trailing slash.
# Examples: "http://foo.com/static/admin/", "/static/admin/".
ADMIN_MEDIA_PREFIX = '/static/admin/'

STATICFILES_STORAGE = 'pipeline.storage.PipelineStorage'

PIPELINE = not DEBUG

PIPELINE_JS = {
    'scripts_c': {
        'source_filenames': (
          'js/libs/backbone-tastypie.js',
          'js/libs/bootstrap-wysihtml5.js',
          'js/libs/bootstrap-timepicker.js',
          'js/libs/jquery.iframe-transport.js',          
          'js/libs/vendor/jquery.ui.widget.js', 
          'js/libs/jquery.fileupload*.js',          
          'js/libs/masonry.min.js',
          'fancybox/lib/jquery.mousewheel-3.0.6.pack.js',
          'fancybox/source/jquery.fancybox.pack.js',
          'fancybox/source/helpers/jquery.fancybox-media.js',
          'js/models/*.js',
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

EVERNOTE_NOTEBOOK = '@Drawer'

EVERNOTE_AUTH_KEY = 'markinhosx'

EVERNOTE_AUTH_SECRET = '3162dc9e83f2f16e'


DROPBOX_AUTH_KEY = '8gvbfoxxb9f98ah'

DROPBOX_AUTH_SECRET = 'xciu5lbxmiiboju'

DROPBOX_ACCESS_TYPE = 'app_folder'

try:
    from local_settings import *
except ImportError:
    pass