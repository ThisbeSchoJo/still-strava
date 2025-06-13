from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    image = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<User {self.username}, Email: {self.email}, Image: {self.image}>'
    
class Activity(db.Model, SerializerMixin):
    __tablename__ = 'activities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    datetime = db.Column(db.DateTime)
    photos = db.Column(db.String)

    def __repr__(self):
        return f'<Activity {self.name}, Description: {self.description}, Datetime: {self.datetime}, Photos: {self.photos}>'
