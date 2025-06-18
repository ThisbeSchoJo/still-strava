#!/usr/bin/env python3

# Standard library imports
from datetime import datetime

# Remote library imports
from flask import request, make_response
from flask_restful import Resource


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

# CRUD for users
class AllUsers(Resource):
    def get(self):
        stmt = select(User)
        result = db.session.execute(stmt)
        users = result.scalars().all()
        response_body = [user.to_dict(only=('id', 'username', 'email', 'image')) for user in users]
        return make_response(response_body, 200)
    
    def post(self):
        try:
            new_user = User(
                username=request.json.get('username'),
                email=request.json.get('email'),
                image=request.json.get('image')
            )
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
            response_body = user.to_dict(only=('id', 'username', 'email', 'image'))
            return make_response(response_body, 200)
        else:
            response_body = {
                "error": "User not found"
            }
            return make_response(response_body, 404)
        
    def patch(self, id):
        user = db.session.get(User, id)
        if user:
            try:
                for attr in request.json:
                    setattr(user, attr, request.json[attr])
                db.session.commit()
                response_body = user.to_dict(only=('id', 'username', 'email', 'image'))
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
        stmt = select(Activity)
        result = db.session.execute(stmt)
        activities = result.scalars().all()
        response_body = [activity.to_dict(only=('id', 'name', 'description', 'datetime', 'photos')) for activity in activities]
        return make_response(response_body, 200)
    
    def post(self):
        try:
            new_activity = Activity(
                name=request.json.get('name'),
                description=request.json.get('description'),
                datetime=request.json.get('datetime'),
                photos=request.json.get('photos')
            )
            db.session.add(new_activity)
            db.session.commit()
            response_body = new_activity.to_dict(only=('id', 'name', 'description', 'datetime', 'photos'))
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
            response_body = activity.to_dict(only=('id', 'name', 'description', 'datetime', 'photos'))
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
                response_body = activity.to_dict(only=('id', 'name', 'description', 'datetime', 'photos'))
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

