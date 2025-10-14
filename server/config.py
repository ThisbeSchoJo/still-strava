# Standard library imports
import os

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_jwt_extended import JWTManager

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)

# Set ALL config before initializing extensions
# Use PostgreSQL in production, SQLite in development
database_url = os.environ.get('DATABASE_URL')
if database_url:
    # Replace postgres:// with postgresql:// for SQLAlchemy compatibility
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'super-secret-key')
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', "your-secret-key")
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False  # Tokens never expire (for development)
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
# Allow both localhost for development and your deployed frontend URL
allowed_origins = ["http://localhost:3000"]
if os.environ.get('FRONTEND_URL'):
    allowed_origins.append(os.environ.get('FRONTEND_URL'))
CORS(app, supports_credentials=True, origins=allowed_origins)

# Instantiate JWT Manager
jwt = JWTManager(app)

