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

class AllUsers(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)
    
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

if __name__ == '__main__':
    app.run(port=5555, debug=True)

