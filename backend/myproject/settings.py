"""
Django settings for myproject project.
"""

from pathlib import Path
import os
import sys
import dj_database_url
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Tells Python to look into the backend folder for 'apps'
sys.path.insert(0, str(BASE_DIR))

# Load the environment variables from the .env file locally
load_dotenv()

# ==========================================
# 1. SECURITY & PRODUCTION SETTINGS
# ==========================================
# Use environment variable for secret key in production, fallback to local string
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-_lc62kh$l5y$*bruz5sz8dv#%l+_a_@l9q@z-4$z=vdti5)2@w')

# Render sets the 'RENDER' environment variable to 'true' automatically.
# This ensures DEBUG is False in production, but True on your local machine.
DEBUG = 'RENDER' not in os.environ

# Allow all hosts so Render can route traffic easily
ALLOWED_HOSTS = ['*'] 


# ==========================================
# 2. APPLICATION DEFINITION
# ==========================================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third Party
    'rest_framework',
    "corsheaders",
    'drf_spectacular',
    'django_filters', 
    
    # Custom Apps
    'myproject.apps.insights',
    'myproject.apps.repositories',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # 🚨 CRITICAL FOR RENDER: Must be right below SecurityMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'myproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'myproject.wsgi.application'


# ==========================================
# 3. DATABASE (Neon Cloud OR Local SQLite)
# ==========================================
if os.environ.get('DATABASE_URL'):
    # If a DATABASE_URL exists (like on Render), use the Neon PostgreSQL Cloud DB
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True 
        )
    }
else:
    # If NO Database URL is found (like when you are testing locally without Docker),
    # fallback to a local SQLite file so you can still test your code offline.
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ==========================================
# 4. STATIC FILES (CSS, JavaScript, Images)
# ==========================================
STATIC_URL = 'static/'
# 🚨 CRITICAL FOR RENDER: Where static files will be collected when you deploy
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# Use Whitenoise to serve static files in production
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# ==========================================
# 5. CORS (Cross-Origin Resource Sharing)
# ==========================================
# Allow the Next.js frontend to talk to this Django backend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# When you deploy your frontend to Vercel, put the Vercel URL in your Render Environment Variables
# (e.g., FRONTEND_URL = https://gitsmart.vercel.app)
if os.environ.get('FRONTEND_URL'):
    CORS_ALLOWED_ORIGINS.append(os.environ.get('FRONTEND_URL'))

# Alternatively, for a portfolio project where you don't mind who hits the API, 
# you can just uncomment the line below to allow all connections:
CORS_ALLOW_ALL_ORIGINS = True


# ==========================================
# 6. REST FRAMEWORK & SPECTACULAR
# ==========================================
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Git-Smart API',
    'DESCRIPTION': 'AI-powered GitHub repository analytics and insights.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}