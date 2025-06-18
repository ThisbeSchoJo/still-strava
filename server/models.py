from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from datetime import datetime
from config import db

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    # Database columns
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    image = db.Column(db.String, nullable=False)

    # Relationships
    activities = db.relationship('Activity', back_populates='user')
    comments = db.relationship('Comment', back_populates='user')

    # Serialization rules to avoid circular references
    serialize_rules = ('-activities', '-comments')

    # Validation methods
    @validates('username', 'image')
    def validate_username(self, key, value):
        if type(value) != str:
            raise TypeError(f"{key} must be a string")
        elif len(value) < 5:
            raise ValueError(f"{key} must be at least 5 characters long")
        else:
            return value

    @validates('email')
    def validate_email(self, key, value):
        if type(value) != str:
            raise TypeError("Email must be a string")
        elif '@' not in value:
            raise ValueError("Invalid email address")
        elif len(value) < 10:
            raise ValueError("Email must be at least 10 characters long")
        else:
            return value

    def __repr__(self):
        return f'<User {self.username}, Email: {self.email}, Image: {self.image}>'
    
class Activity(db.Model, SerializerMixin):
    __tablename__ = 'activities'

    # Database columns
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    activity_type = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    datetime = db.Column(db.DateTime)
    photos = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # Relationships
    comments = db.relationship('Comment', back_populates='activity')
    user = db.relationship('User', back_populates='activities')

    # Serialization rules to avoid circular references
    serialize_rules = ('-comments','-user.activities', '-user.comments')

    # Validation methods
    @validates('title')
    def validate_title(self, key, value):
        if type(value) != str:
            raise TypeError("Title must be a string")
        elif len(value) < 3:
            raise ValueError("Title must be at least 3 characters long")
        else:
            return value
    
    @validates('description')
    def validate_description(self, key, value):
        if type(value) != str:
            raise TypeError("Description must be a string")
        elif len(value) < 10:
            raise ValueError("Description must be at least 10 characters long")
        else:
            return value
        
    @validates('datetime')
    def validate_datetime(self, key, value):
        if type(value) != datetime:
            raise TypeError("Datetime must be a datetime object")
        else:
            return value

    @validates('photos')
    def validate_photos(self, key, value):
        if type(value) != str:
            raise TypeError("Photos must be a string")
        else:
            return value

    def __repr__(self):
        return f'<Activity {self.title}, Description: {self.description}, Datetime: {self.datetime}, Photos: {self.photos}>'

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    # Database columns
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)
    datetime = db.Column(db.DateTime)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # Relationships
    activity = db.relationship('Activity', back_populates='comments')
    user = db.relationship('User', back_populates='comments')

    # Serialization rules to avoid circular references
    serialize_rules = ('-activity.comments', '-user.activities','-user.comments')

    # Validation methods
    @validates('content')
    def validate_content(self, key, value):
        if type(value) != str:
            raise TypeError("Content must be a string")
        elif len(value) < 10:
            raise ValueError("Content must be at least 10 characters long")
        else:
            return value
        
    @validates('datetime')
    def validate_datetime(self, key, value):
        if type(value) != datetime:
            raise TypeError("Datetime must be a datetime object")
        else:
            return value

    def __repr__(self):
        return f'<Comment {self.content}, Datetime: {self.datetime}, Activity: {self.activity_id}, User: {self.user_id}>'
    
