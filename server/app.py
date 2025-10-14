#!/usr/bin/env python3

# Standard library imports
from datetime import datetime, timedelta, timezone
import os
import uuid

# Remote library imports
from flask import request, make_response, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from flask_restful import Resource
from flask_jwt_extended.exceptions import JWTExtendedException
from werkzeug.utils import secure_filename


# Local imports
from config import app, db, api
from sqlalchemy import select


# Add your model imports
from models import User, Activity, Comment, Like, Follow

# Helper function to get activity data with like information
def get_activity_with_likes(activity, current_user_id=None):
    """Get activity data including like count and user's like status"""
    activity_dict = activity.to_dict(only=('id', 'title', 'activity_type', 'description', 'latitude', 'longitude', 'location_name', 'datetime', 'elapsed_time', 'photos', 'user'))
    
    # Get likes with user information
    likes = Like.query.filter_by(activity_id=activity.id).all()
    like_count = len(likes)
    activity_dict['like_count'] = like_count
    
    # Get user information for likes (limit to 5 for display)
    like_users = []
    for like in likes[:5]:  # Limit to 5 users for display
        user = db.session.get(User, like.user_id)
        if user:
            like_users.append({
                'id': user.id,
                'username': user.username,
                'image': user.image
            })
    activity_dict['like_users'] = like_users
    
    # Check if current user has liked this activity
    if current_user_id:
        user_liked = Like.query.filter_by(
            user_id=current_user_id, 
            activity_id=activity.id
        ).first() is not None
        activity_dict['user_liked'] = user_liked
    else:
        activity_dict['user_liked'] = False
    
    return activity_dict


# Views go here!

# Root route - serves as API landing page
@app.route('/')
def index():
    return '<h1>Still Strava API</h1><p>Backend is running!</p>'

# Serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

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
        token = create_access_token(identity=user.id)
    
        return  {
            'token': token,
            'user': user.to_dict(only=('id', 'username', 'email', 'image'))
        }, 200
api.add_resource(Login, '/login')

class Signup(Resource):
    def post(self):
        data = request.json

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
            return {'error': str(e)}, 400

        token = create_access_token(identity=user.id)

        return {
            'token': token,
            'user': user.to_dict(only=('id', 'username','email','image'))
        }, 201

api.add_resource(Signup, '/signup')

class Me(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        user = db.session.get(User, current_user_id)
        if not user:
            return {'error': 'User not found'}, 404
        return user.to_dict(only=('id', 'username', 'email', 'image'))

api.add_resource(Me, '/me')


# CRUD for users
class AllUsers(Resource):
    def get(self):
        stmt = select(User)
        result = db.session.execute(stmt)
        users = result.scalars().all()
        
        # Get current user to check follow status
        current_user_id = None
        if request.headers.get('Authorization'):
            try:
                from flask_jwt_extended import verify_jwt_in_request
                verify_jwt_in_request()
                current_user_id = get_jwt_identity()
            except Exception as e:
                # If JWT is invalid, just continue without user context
                current_user_id = None
        
        response_body = []
        for user in users:
            user_dict = user.to_dict(only=('id', 'username', 'email', 'image', 'location', 'bio'))
            
            # Add activity and follower counts
            user_dict['activities'] = len(user.activities)
            user_dict['followers'] = len(user.followers)
            
            # Check if current user is following this user
            if current_user_id and current_user_id != user.id:
                is_following = Follow.query.filter_by(
                    follower_id=current_user_id,
                    followed_id=user.id
                ).first() is not None
                user_dict['isFollowing'] = is_following
            else:
                user_dict['isFollowing'] = False
            
            response_body.append(user_dict)
        
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
            # Get current user ID from request if available
            current_user_id = request.args.get('user_id', type=int)
            
            response_body = user.to_dict(only=(
                'id', 'username', 'email', 'image',
                'bio', 'location', 'website', 'twitter', 'instagram',
                'comments', 'followers', 'following'
            ))
            
            # Process activities with like information
            activities_with_likes = []
            for activity in user.activities:
                activity_with_likes = get_activity_with_likes(activity, current_user_id)
                activities_with_likes.append(activity_with_likes)
            
            response_body['activities'] = activities_with_likes
            
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

# CRUD for follows
class FollowUser(Resource):
    # ensure user is authenticated
    @jwt_required()
    def post(self, user_id):
        try:
            current_user_id = get_jwt_identity()
            
            # Check if user exists
            user = db.session.get(User, user_id)
            if not user:
                return make_response({"error": "User not found."}, 404)
            
            if current_user_id == user_id:
                return make_response({"error": "You cannot follow yourself."}, 400)
            
            # Prevent duplicate follows
            existing = Follow.query.filter_by(follower_id=current_user_id, followed_id=user_id).first()
            if existing:
                return make_response({"error": "Already following."}, 400)
            
            follow = Follow(follower_id=current_user_id, followed_id=user_id)
            db.session.add(follow)
            db.session.commit()
            return make_response({"message": "Followed successfully."}, 201)
        except Exception as e:
            return make_response({"error": str(e)}, 422)

api.add_resource(FollowUser, '/users/<int:user_id>/follow')

class UnfollowUser(Resource):
    # ensure user is authenticated
    @jwt_required()
    def delete(self, user_id):
        current_user_id = get_jwt_identity()
        follow = Follow.query.filter_by(follower_id=current_user_id, followed_id=user_id).first()
        if not follow:
            return make_response({"error": "Not following."}, 400)
        db.session.delete(follow)
        db.session.commit()
        return make_response({"message": "Unfollowed successfully."}, 200)

api.add_resource(UnfollowUser, '/users/<int:user_id>/unfollow')

class AllFollowers(Resource):
    def get(self, user_id):
        user = db.session.get(User, user_id)
        if not user:
            return make_response({"error": "User not found"}, 404)
        followers = user.followers
        return make_response([f.follower.to_dict() for f in followers], 200)
    
api.add_resource(AllFollowers, '/users/<int:user_id>/followers')

class AllFollowing(Resource):
    def get(self, user_id):
        user = db.session.get(User, user_id)
        if not user:
            return make_response({"error": "User not found"}, 404)
        following = user.following
        return make_response([f.followed.to_dict() for f in following], 200)
    
api.add_resource(AllFollowing, '/users/<int:user_id>/following')

class UserSearch(Resource):
    def get(self):
        query = request.args.get('q', '').strip()
        
        if not query:
            return make_response([], 200)
        
        # Search users by username (case-insensitive)
        users = User.query.filter(
            User.username.ilike(f'%{query}%')
        ).limit(20).all()  # Limit results to 20 users
        
        # Get current user to check follow status
        current_user_id = None
        if request.headers.get('Authorization'):
            try:
                current_user_id = get_jwt_identity()
            except:
                # If JWT is invalid, just continue without user context
                current_user_id = None
        
        results = []
        for user in users:
            user_dict = user.to_dict(only=('id', 'username', 'email', 'image', 'location', 'bio'))
            
            # Add activity and follower counts (using len() to avoid serialization issues)
            user_dict['activities'] = len(user.activities)
            user_dict['followers'] = len(user.followers)
            
            # Check if current user is following this user
            if current_user_id and current_user_id != user.id:
                is_following = Follow.query.filter_by(
                    follower_id=current_user_id,
                    followed_id=user.id
                ).first() is not None
                user_dict['isFollowing'] = is_following
            else:
                user_dict['isFollowing'] = False
            
            results.append(user_dict)
        
        return make_response(results, 200)

api.add_resource(UserSearch, '/users/search')

# File upload endpoint
class UploadImage(Resource):
    @jwt_required()
    def post(self):
        try:
            if 'image' not in request.files:
                return make_response({"error": "No image file provided"}, 400)
            
            file = request.files['image']
            if file.filename == '':
                return make_response({"error": "No file selected"}, 400)
            
            # Check file type
            allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
            if not file.filename.lower().endswith(tuple('.' + ext for ext in allowed_extensions)):
                return make_response({"error": "Invalid file type. Please upload an image."}, 400)
            
            # Create uploads directory if it doesn't exist
            upload_folder = 'uploads'
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
            
            # Generate unique filename
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(upload_folder, unique_filename)
            
            # Save file
            file.save(file_path)
            
            # Return the URL (in production, this would be a CDN URL)
            image_url = f"/uploads/{unique_filename}"
            
            return make_response({"imageUrl": image_url}, 200)
            
        except Exception as e:
            return make_response({"error": str(e)}, 500)

api.add_resource(UploadImage, '/upload-image')

# CRUD for activities
class AllActivities(Resource):
    def get(self):
        # Get current user ID from request if available
        current_user_id = request.args.get('user_id', type=int)
        
        if current_user_id:
            # Get the current user and their following relationships
            current_user = db.session.get(User, current_user_id)
            if not current_user:
                return make_response({"error": "User not found"}, 404)
            
            # Get IDs of users the current user is following
            following_ids = [follow.followed_id for follow in current_user.following]
            
            # Add current user's own ID to the list
            following_ids.append(current_user_id)
            
            # Filter activities to only include posts from followed users and current user
            stmt = select(Activity).where(Activity.user_id.in_(following_ids))
            result = db.session.execute(stmt)
            activities = result.scalars().all()
        else:
            # If no user is logged in, show all activities (or you could return empty)
            stmt = select(Activity)
            result = db.session.execute(stmt)
            activities = result.scalars().all()
        
        response_body = [get_activity_with_likes(activity, current_user_id) for activity in activities]
        
        return make_response(response_body, 200)
    
    def post(self):
        try:
            # Convert datetime string to datetime object if provided
            datetime_str = request.json.get('datetime')
            datetime_obj = datetime.fromisoformat(datetime_str) if datetime_str else datetime.now(timezone.utc)
            
            new_activity = Activity(
                title=request.json.get('title'),
                activity_type=request.json.get('activity_type'),
                description=request.json.get('description'),
                latitude=request.json.get('latitude'),
                longitude=request.json.get('longitude'),
                location_name=request.json.get('location_name'),
                datetime=datetime_obj,
                elapsed_time=request.json.get('elapsed_time'),
                photos=request.json.get('photos'),
                user_id=request.json.get('user_id')
            )
            db.session.add(new_activity)
            db.session.commit()
            
            # Get current user ID for like status
            current_user_id = request.json.get('user_id')
            response_body = get_activity_with_likes(new_activity, current_user_id)
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
            # Get current user ID from request if available
            current_user_id = request.args.get('user_id', type=int)
            response_body = get_activity_with_likes(activity, current_user_id)
            return make_response(response_body, 200)
        else:
            return make_response({"error": "Activity not found"}, 404)

    def patch(self, id):
        activity = db.session.get(Activity, id)
        if activity:
            try:
                data = request.json
                
                # Only update allowed fields
                allowed_fields = ['title', 'activity_type', 'description', 'song', 'location_name', 'photos']
                
                for field in allowed_fields:
                    if field in data:
                        # Handle empty strings for optional fields
                        if field in ['description', 'song', 'location_name', 'photos'] and data[field] == '':
                            setattr(activity, field, None)
                        else:
                            setattr(activity, field, data[field])
                
                db.session.commit()
                
                # Get current user ID for like status
                current_user_id = data.get('user_id')
                response_body = get_activity_with_likes(activity, current_user_id)
                return make_response(response_body, 200)
            except Exception as e:
                db.session.rollback()
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
            try:
                db.session.delete(activity)
                db.session.commit()
                return make_response({}, 204)
            except Exception as e:
                db.session.rollback()
                response_body = {
                    "error": str(e)
                }
                return make_response(response_body, 422)
        else:
            response_body = {
                "error": "Activity not found"
            }
            return make_response(response_body, 404)
        
api.add_resource(ActivityById, '/activities/<int:id>')

# CRUD for comments
class AllComments(Resource):
    def get(self):
        activity_id = request.args.get('activity_id', type=int)
        if activity_id:
            comments = Comment.query.filter_by(activity_id=activity_id).all()
        else:
            stmt = select(Comment)
            result = db.session.execute(stmt)
            comments = result.scalars().all()
        
        # Include user information in the response
        response_body = []
        for comment in comments:
            comment_dict = comment.to_dict(only=('id', 'content', 'datetime', 'activity_id', 'user_id'))
            if comment.user:
                comment_dict['user'] = comment.user.to_dict(only=('id', 'username', 'image'))
            response_body.append(comment_dict)
        
        return make_response(response_body, 200)
    
    def post(self):
        try:
            # Parse datetime string to datetime object
            datetime_str = request.json.get('datetime')
            if datetime_str:
                comment_datetime = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
            else:
                comment_datetime = datetime.now(timezone.utc)
            
            new_comment = Comment(
                content=request.json.get('content'),
                datetime=comment_datetime,
                activity_id=request.json.get('activity_id'),
                user_id=request.json.get('user_id')
            )
            db.session.add(new_comment)
            db.session.commit()
            
            # Return comment with user information
            response_body = new_comment.to_dict(only=('id', 'content', 'datetime', 'activity_id', 'user_id'))
            if new_comment.user:
                response_body['user'] = new_comment.user.to_dict(only=('id', 'username', 'image'))
            
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

# Like/Unlike functionality
class LikeActivity(Resource):
    def post(self, activity_id):
        """Like an activity"""
        try:
            data = request.json
            user_id = data.get('user_id')
            
            if not user_id:
                return make_response({"error": "User ID is required"}, 400)
            
            # Check if user already liked this activity
            existing_like = Like.query.filter_by(
                user_id=user_id, 
                activity_id=activity_id
            ).first()
            
            if existing_like:
                return make_response({"error": "User already liked this activity"}, 400)
            
            # Create new like
            new_like = Like(
                user_id=user_id,
                activity_id=activity_id,
                created_at=datetime.now(timezone.utc)
            )
            
            db.session.add(new_like)
            db.session.commit()
            
            # Get the updated activity with like information
            activity = db.session.get(Activity, activity_id)
            if activity:
                response_body = get_activity_with_likes(activity, user_id)
                return make_response(response_body, 201)
            else:
                return make_response({"error": "Activity not found"}, 404)
            
        except Exception as e:
            db.session.rollback()
            return make_response({"error": str(e)}, 422)

class UnlikeActivity(Resource):
    def delete(self, activity_id):
        """Unlike an activity"""
        try:
            data = request.json
            user_id = data.get('user_id')
            
            if not user_id:
                return make_response({"error": "User ID is required"}, 400)
            
            # Find and delete the like
            like = Like.query.filter_by(
                user_id=user_id, 
                activity_id=activity_id
            ).first()
            
            if not like:
                return make_response({"error": "Like not found"}, 404)
            
            db.session.delete(like)
            db.session.commit()
            
            # Get the updated activity with like information
            activity = db.session.get(Activity, activity_id)
            if activity:
                response_body = get_activity_with_likes(activity, user_id)
                return make_response(response_body, 200)
            else:
                return make_response({"error": "Activity not found"}, 404)
            
        except Exception as e:
            db.session.rollback()
            return make_response({"error": str(e)}, 422)

api.add_resource(LikeActivity, '/activities/<int:activity_id>/like')
api.add_resource(UnlikeActivity, '/activities/<int:activity_id>/unlike')

@app.errorhandler(422)
def handle_unprocessable_entity(err):
    return make_response({"error": str(err)}, 422)

@app.errorhandler(JWTExtendedException)
def handle_jwt_error(e):
    return make_response({"error": str(e)}, 401)

@app.errorhandler(Exception)
def handle_general_error(e):
    return make_response({"error": str(e)}, 500)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5555))
    app.run(host='0.0.0.0', port=port, debug=False)

