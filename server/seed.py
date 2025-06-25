#!/usr/bin/env python3

from random import choice as rc
from datetime import datetime
from faker import Faker

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
        users = []
        for i in range(10):
            user = User(
                username=fake.user_name() + str(i),
                email=fake.email(),
                image=fake.image_url(),
                bio=fake.sentence(nb_words=10),
                location=fake.city(),
                website=fake.url(),
                twitter=fake.user_name(),
                instagram=fake.user_name()
            )
            user.set_password("password123")  # Optional: set a default password
            users.append(user)

        db.session.add_all(users)
        db.session.commit()

        print("Creating activities...")
        activity_types = [
            "Hammocking", "Rockhounding", "Sunset Watching", "Sunrise Watching",
            "Camping", "Foraging", "Stargazing", "Bird Watching", "Wood carving",
            "Seashell Collecting", "Fossil Hunting", "Fishing", "Picnicking",
            "Mycology Walk", "Outdoor Reading", "Campfire", "Bioblitzing",
            "Catching fireflies", "Tidepooling", "Building a sandcastle",
            "Building a snowman", "Skipping stones", "Catching amphibians and reptiles",
            "Gardening"
        ]

        activities = []
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
        comments = []
        for i in range(30):
            comment = Comment(
                content=fake.paragraph(nb_sentences=2),
                datetime=fake.date_time_this_year(),
                activity_id=rc(activities).id,
                user_id=rc(users).id
            )
            comments.append(comment)

        db.session.add_all(comments)
        db.session.commit()

        print("Seeding complete!")
