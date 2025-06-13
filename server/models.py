from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    image = db.Column(db.String, nullable=False)

    activities = db.relationship('Activity', backref='user', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)

    serialize_rules = ('-activities.user', '-comments.user')

    @validates('username', 'image')
    def validate_username(self, column_name, value):
        if type(value) != str:
            raise TypeError(f"{column_name} must be a string")
        elif len(value) < 5:
            raise ValueError(f"{column_name} must be at least 5 characters long")
        else:
            return value

    @validates('email')
    def validate_email(self, email):
        if type(email) != str:
            raise TypeError("Email must be a string")
        elif '@' not in email:
            raise ValueError("Invalid email address")
        elif len(email) < 10:
            raise ValueError("Email must be at least 10 characters long")
        else:
            return email

    def __repr__(self):
        return f'<User {self.username}, Email: {self.email}, Image: {self.image}>'
    
class Activity(db.Model, SerializerMixin):
    __tablename__ = 'activities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    datetime = db.Column(db.DateTime)
    photos = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    comments = db.relationship('Comment', backref='activity', lazy=True)
    
    serialize_rules = ('-comments.activity',)

    @validates('name')
    def validate_name(self, name):
        if type(name) != str:
            raise TypeError("Name must be a string")
        elif len(name) < 3:
            raise ValueError("Name must be at least 3 characters long")
        else:
            return name
    
    @validates('description')
    def validate_description(self, description):
        if type(description) != str:
            raise TypeError("Description must be a string")
        elif len(description) < 10:
            raise ValueError("Description must be at least 10 characters long")
        else:
            return description
        
    @validates('datetime')
    def validate_datetime(self, datetime):
        if type(datetime) != datetime.datetime:
            raise TypeError("Datetime must be a datetime object")
        else:
            return datetime

    @validates('photos')
    def validate_photos(self, photos):
        if type(photos) != str:
            raise TypeError("Photos must be a string")
        else:
            return photos

    def __repr__(self):
        return f'<Activity {self.name}, Description: {self.description}, Datetime: {self.datetime}, Photos: {self.photos}>'

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)
    datetime = db.Column(db.DateTime)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    serialize_rules = ('-activity.comments', '-user.comments')
    
    @validates('content')
    def validate_content(self, content):
        if type(content) != str:
            raise TypeError("Content must be a string")
        elif len(content) < 10:
            raise ValueError("Content must be at least 10 characters long")
        else:
            return content
        
    @validates('datetime')
    def validate_datetime(self, datetime):
        if type(datetime) != datetime.datetime:
            raise TypeError("Datetime must be a datetime object")
        else:
            return datetime

    def __repr__(self):
        return f'<Comment {self.content}, Datetime: {self.datetime}, Activity: {self.activity_id}, User: {self.user_id}>'
    
