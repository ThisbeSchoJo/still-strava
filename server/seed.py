from app import app
from models import db, User, Activity, Comment, Like
from datetime import datetime
import random

with app.app_context():
    print("Clearing db...")
    User.query.delete()
    Activity.query.delete()
    Comment.query.delete()
    Like.query.delete()
    db.session.commit()

    print("Seeding users...")
    users = [
        User(
            username="trailblazer",
            email="trail@example.com",
            image="https://randomuser.me/api/portraits/women/44.jpg",
            bio="Always chasing the next summit.",
            location="Boulder, CO"
        ),
        User(
            username="urbanrunner",
            email="run@example.com",
            image="https://randomuser.me/api/portraits/men/32.jpg",
            bio="City streets, early mornings.",
            location="Brooklyn, NY"
        ),
        User(
            username="flowstate",
            email="yoga@example.com",
            image="https://randomuser.me/api/portraits/women/65.jpg",
            bio="Stretch, breathe, repeat.",
            location="Santa Barbara, CA"
        ),
        User(
            username="coastalcruiser",
            email="coast@example.com",
            image="https://randomuser.me/api/portraits/men/77.jpg",
            bio="Wheels + waves = peace.",
            location="San Diego, CA"
        )
    ]

    for u in users:
        u.set_password("password123")
        db.session.add(u)

    db.session.commit()

    print("Seeding activities...")
    activities = [
        Activity(
            title="Sunrise Hike at Flatirons",
            activity_type="Hiking",
            description="Caught the first light hitting the peaks—magical morning.",
            datetime=datetime(2025, 6, 20, 6, 30),
            photos="https://th.bing.com/th/id/OIP.2G7wnXuBOqQAu7rH7Z17lQHaFj?r=0&rs=1&pid=ImgDetMain&cb=idpwebpc2",
            user_id=users[0].id,
            latitude=39.9867,
            longitude=-105.2750,
            location_name="Flatirons, Boulder"
        ),
        Activity(
            title="5K Tempo Run",
            activity_type="Running",
            description="Fastest time yet on my loop through Prospect Park!",
            datetime=datetime(2025, 6, 21, 7, 15),
            photos="https://th.bing.com/th/id/OIP.jhheKYAobxpgo-vJ7vYAlQHaE8?r=0&rs=1&pid=ImgDetMain&cb=idpwebpc2",
            user_id=users[1].id,
            latitude=40.6602,
            longitude=-73.9690,
            location_name="Prospect Park, Brooklyn"
        ),
        Activity(
            title="Evening Flow",
            activity_type="Yoga",
            description="A calming 45-min vinyasa session. Just what I needed.",
            datetime=datetime(2025, 6, 22, 18, 0),
            photos="https://res.cloudinary.com/peloton-cycle/image/fetch/dpr_1.0,f_auto,q_auto:good,w_1800/https://s3.amazonaws.com/peloton-ride-images/96a0b61b8375711d23f73ad94a3c3bd6a94c2b78/img_1631227222_89d81453f6bb490ca8028947789b3671.png",
            user_id=users[2].id,
            latitude=34.4208,
            longitude=-119.6982,
            location_name="Santa Barbara Beach"
        ),
        Activity(
            title="Coastal Ride",
            activity_type="Cycling",
            description="Chilly wind, but the views made up for it!",
            datetime=datetime(2025, 6, 23, 9, 45),
            photos="https://th.bing.com/th/id/R.8215af7573f743fd39436cf4c1900118?rik=AfMS%2fBqXf8yFng&pid=ImgRaw&r=0",
            user_id=users[3].id,
            latitude=32.7157,
            longitude=-117.1611,
            location_name="Pacific Coast Highway, San Diego"
        )
    ]

    db.session.add_all(activities)
    db.session.commit()

    print("Seeding comments...")
    comments = [
        Comment(
            content="That looks amazing!",
            datetime=datetime.now(),
            activity_id=activities[0].id,
            user_id=users[1].id
        ),
        Comment(
            content="Inspiring pace. Keep it up!",
            datetime=datetime.now(),
            activity_id=activities[1].id,
            user_id=users[0].id
        ),
        Comment(
            content="I needed this reminder to slow down. Thank you.",
            datetime=datetime.now(),
            activity_id=activities[2].id,
            user_id=users[3].id
        )
    ]

    db.session.add_all(comments)
    db.session.commit()

    print("Seeding likes...")
    # Create some random likes between users and activities
    likes = []
    for activity in activities:
        # Each activity gets 1-3 random likes from different users
        num_likes = random.randint(1, 3)
        likers = random.sample(users, num_likes)
        
        for liker in likers:
            # Don't let users like their own activities
            if liker.id != activity.user_id:
                likes.append(
                    Like(
                        user_id=liker.id,
                        activity_id=activity.id,
                        created_at=datetime.now()
                    )
                )
    
    db.session.add_all(likes)
    db.session.commit()
    print("✅ Done seeding!")
