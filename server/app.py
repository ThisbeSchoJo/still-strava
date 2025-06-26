#!/usr/bin/env python3

# Standard library imports
from datetime import datetime, timedelta, timezone

# Remote library imports
from flask import request, make_response, current_app
from flask_restful import Resource
import jwt
# from resources.signup import Signup


# Local imports
from config import app, db, api
from sqlalchemy import select


# Add your model imports
from models import User, Activity, Comment


# Views go here!

# Root route - serves as API landing page
@app.route('/')
def index():
    return '<h1>Still Strava</h1>'

# Login route
class Login(Resource):
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')
    
        if not email or not password:
            return {'error': 'Email and password are required'}, 400
    
        user = User.query.filter_by(email=email).first()
    
        if not user or not user.authenticate(password):
            return {'error': 'Invalid email or password'}, 401
    
        # Generate JWT token
        payload = {
            'user_id': user.id,
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)
        }
        token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    
        return  {
            'token': token,
            'user': user.to_dict(only=('id', 'username', 'email', 'image'))
        }, 200
api.add_resource(Login, '/login')

class Signup(Resource):
    def post(self):
        data = request.json
        print("SIGNUP data received:", data)

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        image = data.get('image') or "https://i.pinimg.com/originals/94/9e/9a/949e9acf4df6075391f21248765bd8c3.jpg"  # ← default image URL

        if not all([username, email, password]):
            return {'error': 'Username, email, and password are required'}, 400

        if User.query.filter_by(email=email).first():
            return {'error': 'Email already in use'}, 400

        try:
            user = User(username=username, email=email, image=image)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            print("Error during user creation:", e)  # <-- ADD THIS
            return {'error': str(e)}, 400

        payload = {
            'user_id': user.id,
            'exp': datetime.now(timezone.utc)+timedelta(hours=24)
        }
        token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

        return {
            'token': token,
            'user': user.to_dict(only=('id', 'username','email','image'))
        }, 201

api.add_resource(Signup, '/signup')

class Me(Resource):
    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return {'error': 'Authorization header missing'}, 401

        token = auth_header.split(" ")[1]  # Expecting "Bearer <token>"
        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user = db.session.get(User, payload['user_id'])
            if not user:
                return {'error': 'User not found'}, 404
            return user.to_dict(only=('id', 'username', 'email', 'image'))
        except jwt.ExpiredSignatureError:
            return {'error': 'Token expired'}, 401
        except jwt.InvalidTokenError:
            return {'error': 'Invalid token'}, 401

api.add_resource(Me, '/me')


# CRUD for users
class AllUsers(Resource):
    def get(self):
        stmt = select(User)
        result = db.session.execute(stmt)
        users = result.scalars().all()
        response_body = [user.to_dict(only=('id', 'username', 'email', 'image')) for user in users]
        return make_response(response_body, 200)
    
    # update : data=request.json >>> data.get('password') etc
    def post(self):
        try:
            password = request.json.get('password')
            if not password:
                return make_response({"error": "Password is required"}, 400)
            new_user = User(
                username=request.json.get('username'),
                email=request.json.get('email'),
                image=request.json.get('image')
            )
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()
            response_body = new_user.to_dict(only=('id', 'username', 'email', 'image'))
            return make_response(response_body, 201)
        except Exception as e:
            response_body = {
                "error": str(e)
            }
            return make_response(response_body, 422)
        
api.add_resource(AllUsers, '/users')

class UserById(Resource):
    def get(self, id):
        user = db.session.get(User, id)
        if user:
            response_body = user.to_dict(only=(
                'id', 'username', 'email', 'image',
                'bio', 'location', 'website', 'twitter', 'instagram',
                'activities', 'comments'
            ))
            return make_response(response_body, 200)
        else:
            response_body = {
                "error": "User not found"
            }
            return make_response(response_body, 404)
        
    def patch(self, id):
        USER_PROFILE_FIELDS = (
            'id', 'username', 'email', 'image',
            'bio', 'location', 'website', 'twitter', 'instagram',
            'activities', 'comments'
        )
        user = db.session.get(User, id)
        if user:
            try:
                for attr in request.json:
                    setattr(user, attr, request.json[attr])
                db.session.commit()
                response_body = user.to_dict(only=USER_PROFILE_FIELDS)
                return make_response(response_body, 200)
            except Exception as e:
                response_body = {
                    "error": str(e)
                }
                return make_response(response_body, 422)
        else:
            response_body = {
                "error": "User not found"
            }
            return make_response(response_body, 404)
        
    def delete(self, id):
        user = db.session.get(User, id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response({}, 204)
        else:
            response_body = {
                "error": "User not found"
            }
            return make_response(response_body, 404)
        
api.add_resource(UserById, '/users/<int:id>')

# CRUD for activities
class AllActivities(Resource):
    def get(self):
        print("Fetching all activities...")
        stmt = select(Activity)
        result = db.session.execute(stmt)
        activities = result.scalars().all()
        print(f"Found {len(activities)} activities")
        
        response_body = [activity.to_dict(only=('id', 'title', 'activity_type', 'description', 'datetime', 'photos', 'user')) for activity in activities]
        print("Response body:", response_body)
        
        return make_response(response_body, 200)
    
    def post(self):
        try:
            new_activity = Activity(
                title=request.json.get('title'),
                activity_type=request.json.get('activity_type'),
                description=request.json.get('description'),
                datetime=request.json.get('datetime'),
                photos=request.json.get('photos'),
                user_id=request.json.get('user_id')
            )
            db.session.add(new_activity)
            db.session.commit()
            response_body = new_activity.to_dict(only=('id', 'title', 'activity_type', 'description', 'datetime', 'photos', 'user'))
            return make_response(response_body, 201)
        except Exception as e:
            response_body = {
                "error": str(e)
            }
            return make_response(response_body, 422)

api.add_resource(AllActivities, '/activities')

class ActivityById(Resource):
    def get(self, id):
        activity = db.session.get(Activity, id)
        if activity:
            response_body = activity.to_dict(only=('id', 'title', 'activity_type', 'description', 'datetime', 'photos', 'user'))
            return make_response(response_body, 200)
        else:
            return make_response({"error": "Activity not found"}, 404)

    def patch(self, id):
        activity = db.session.get(Activity, id)
        if activity:
            try:
                for attr in request.json:
                    setattr(activity, attr, request.json[attr])
                db.session.commit()
                response_body = activity.to_dict(only=('id', 'title', 'activity_type', 'description', 'datetime', 'photos', 'user'))
                return make_response(response_body, 200)
            except Exception as e:
                response_body = {
                    "error": str(e)
                }
                return make_response(response_body, 422)
        else:
            response_body = {
                "error": "Activity not found"
            }
            return make_response(response_body, 404)
        
    def delete(self, id):
        activity = db.session.get(Activity, id)
        if activity:
            db.session.delete(activity)
            db.session.commit()
            return make_response({}, 204)
        else:
            response_body = {
                "error": "Activity not found"
            }
            return make_response(response_body, 404)
        
api.add_resource(ActivityById, '/activities/<int:id>')

# CRUD for comments
class AllComments(Resource):
    def get(self):
        stmt = select(Comment)
        result = db.session.execute(stmt)
        comments = result.scalars().all()
        response_body = [comment.to_dict(only=('id', 'content', 'datetime', 'activity_id', 'user_id')) for comment in comments]
        return make_response(response_body, 200)
    
    def post(self):
        try:
            new_comment = Comment(
                content=request.json.get('content'),
                datetime=request.json.get('datetime'),
                activity_id=request.json.get('activity_id'),
                user_id=request.json.get('user_id')
            )
            db.session.add(new_comment)
            db.session.commit()
            response_body = new_comment.to_dict(only=('id', 'content', 'datetime', 'activity_id', 'user_id'))
            return make_response(response_body, 201)
        except Exception as e:
            response_body = {
                "error": str(e)
            }
            return make_response(response_body, 422)

api.add_resource(AllComments, '/comments')

class CommentById(Resource):
    def get(self, id):
        comment = db.session.get(Comment, id)
        if comment:
            response_body = comment.to_dict(only=('id', 'content', 'datetime', 'activity_id', 'user_id'))
            return make_response(response_body, 200)
        else:
            response_body = {
                "error": "Comment not found"
            }
            return make_response(response_body, 404)
        
    def patch(self, id):
        comment = db.session.get(Comment, id)
        if comment:
            try:
                for attr in request.json:
                    setattr(comment, attr, request.json[attr])
                db.session.commit()
                response_body = comment.to_dict(only=('id', 'content', 'datetime', 'activity_id', 'user_id'))
                return make_response(response_body, 200)
            except Exception as e:
                response_body = {
                    "error": str(e)
                }
                return make_response(response_body, 422)
        else:
            response_body = {
                "error": "Comment not found"
            }
            return make_response(response_body, 404)
        
    def delete(self, id):
        comment = db.session.get(Comment, id)
        if comment:
            db.session.delete(comment)
            db.session.commit()
            return make_response({}, 204)
        else:
            response_body = {
                "error": "Comment not found"
            }
            return make_response(response_body, 404)
        
api.add_resource(CommentById, '/comments/<int:id>')              

if __name__ == '__main__':
    app.run(port=5555, debug=True)

