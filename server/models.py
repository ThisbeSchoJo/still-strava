from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from datetime import datetime
from config import db
import bcrypt

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    # Database columns
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    image = db.Column(db.String)
    bio = db.Column(db.String)
    location = db.Column(db.String)
    website = db.Column(db.String)
    twitter = db.Column(db.String)
    instagram = db.Column(db.String)

    # Relationships
    activities = db.relationship('Activity', back_populates='user')
    comments = db.relationship('Comment', back_populates='user')
    likes = db.relationship('Like', back_populates='user')

    # Relationships for following/followers
    following = db.relationship(
        'Follow',
        foreign_keys='Follow.follower_id',
        backref='follower_user',
        cascade='all, delete-orphan'
    )

    # Users who follow this user
    followers = db.relationship(
        'Follow',
        foreign_keys='Follow.followed_id',
        backref='followed_user',
        cascade='all, delete-orphan'
    )

    # Serialization rules to avoid circular references
    serialize_rules = ('-activities', '-comments', '-password_hash')

    # Password methods
    def set_password(self, password):
        """Hash and set the user's password"""
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        """Verify the user's password"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    # Validation methods
    @validates('username')
    def validate_username(self, key, value):
        if type(value) != str:
            raise TypeError("Username must be a string")
        elif len(value) < 4:
            raise ValueError("Username must be at least 4 characters long")
        return value

    @validates('image')
    def validate_image(self, key, value):
        # Only validate if an image is provided
        if value:
            if type(value) != str:
                raise TypeError("Image must be a string")
            elif len(value) < 5:
                raise ValueError("Image URL must be at least 5 characters long")
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
    song = db.Column(db.String)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    location_name = db.Column(db.String)
    datetime = db.Column(db.DateTime)
    photos = db.Column(db.String)
    likes = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # Relationships
    comments = db.relationship('Comment', back_populates='activity')
    user = db.relationship('User', back_populates='activities')
    likes = db.relationship('Like', back_populates='activity')

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

    @validates('longitude', 'latitude')
    def validate_location(self, key, value):
        if value is not None and value != "":
            try:
                return float(value)
            except (ValueError, TypeError):
                raise TypeError("Location must be a valid number")
        return None
        
    @validates('location_name')
    def validate_location_name(self, key, value):
        if value is not None and value != "":
            if type(value) != str:
                raise TypeError("Location name must be a string")
            elif len(value) < 3:
                raise ValueError("Location name must be at least 3 characters long")
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
        return f'<Activity {self.title}, Description: {self.description}, Location: {self.location_name}, Datetime: {self.datetime}, Photos: {self.photos}>'

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
    

class Like(db.Model, SerializerMixin):
    __tablename__ = 'likes'

    # Database columns
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='likes')
    activity = db.relationship('Activity', back_populates='likes')

    # Serialization rules to avoid circular references
    serialize_rules = ('-user.likes', '-user.activities', '-user.comments', 
                      '-activity.likes', '-activity.comments', '-activity.user')

    # Validation methods
    @validates('user_id')
    def validate_user_id(self, key, value):
        if not isinstance(value, int):
            raise TypeError("User ID must be an integer")
        return value

    @validates('activity_id')
    def validate_activity_id(self, key, value):
        if not isinstance(value, int):
            raise TypeError("Activity ID must be an integer")
        return value

    def __repr__(self):
        return f'<Like User: {self.user_id}, Activity: {self.activity_id}, Created: {self.created_at}>'
    

class Follow(db.Model, SerializerMixin):
    __tablename__ = 'follows'
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relationships
    follower = db.relationship('User', foreign_keys=[follower_id], backref='following_assoc')
    followed = db.relationship('User', foreign_keys=[followed_id], backref='followers_assoc')

    __table_args__ = (
        db.UniqueConstraint('follower_id', 'followed_id', name='unique_follow'),
    )

    # Serialization rules to avoid circular references
    serialize_rules = ('-follower.follows', '-follower.activities', '-follower.comments',
                      '-followed.followers', '-followed.activities', '-followed.comments')
    
    # Validation methods
    @validates('follower_id', 'followed_id')
    def validate_follower_id(self, key, value):
        if not isinstance(value, int):
            raise TypeError("Follower ID and Followed ID must be an integer")
        return value
    
    def __repr__(self):
        return f'<Follower: {self.follower_id}, Followed: {self.followed_id}>'
    
