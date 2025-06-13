#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Activity, Comment


# Views go here!

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
        user = User.query.filter_by(id=id).first()

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
        
    
    

if __name__ == '__main__':
    app.run(port=5555, debug=True)

