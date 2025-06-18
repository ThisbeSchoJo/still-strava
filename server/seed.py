#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Activity, Comment

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        # Clear existing data
        print("Deleting existing data...")
        Comment.query.delete()
        Activity.query.delete()
        User.query.delete()
        
        print("Creating users...")
        # Create users
        users = []
        for i in range(10):
            user = User(
                username=fake.user_name() + str(i),  # Ensure unique usernames
                email=fake.email(),
                image=fake.image_url()
            )
            users.append(user)
        
        db.session.add_all(users)
        db.session.commit()
        
        print("Creating activities...")
        # Create activities
        activities = []
        activity_types = [
            "Hammocking",
            "Rockhounding",
            "Sunset Watching",
            "Sunrise Watching",
            "Camping",
            "Foraging",
            "Stargazing",
            "Bird Watching",
            "Wood carving",
            "Seashell Collecting",
            "Fossil Hunting",
            "Fishing",
            "Picnicking",
            "Mycology Walk",
            "Outdoor Reading",
            "Campfire",
            "Bioblitzing",
            "Catching fireflies",
            "Tidepooling",
            "Building a sandcastle",
            "Building a snowman",
            "Skipping stones",
            "Catching amphibians and reptiles",
            "Gardening",
        ]
        
        for i in range(20):
            activity = Activity(
                title=rc(activity_types),
                activity_type=rc(activity_types),
                description=fake.paragraph(nb_sentences=3),
                datetime=fake.date_time_this_year(),
                photos=fake.image_url(),
                user_id=rc(users).id
            )
            activities.append(activity)
        
        db.session.add_all(activities)
        db.session.commit()
        
        print("Creating comments...")
        # Create comments
        comments = []
        for i in range(30):
            comment = Comment(
                content=str(fake.paragraph(nb_sentences=2)), 
                datetime=fake.date_time_this_year(),
                activity_id=rc(activities).id,
                user_id=rc(users).id
            )
            comments.append(comment)
        
        db.session.add_all(comments)
        db.session.commit()
        
        print("Seeding complete!")
