from app import app
from models import db, User, Activity, Comment, Like, Follow
from datetime import datetime
import random

with app.app_context():
    print("Clearing db...")
    Follow.query.delete()
    User.query.delete()
    Activity.query.delete()
    Comment.query.delete()
    Like.query.delete()
    db.session.commit()

    print("Seeding users...")
    users = [
        User(
            username="naturelover",
            email="nature@example.com",
            image="https://randomuser.me/api/portraits/women/44.jpg",
            bio="Finding peace in the outdoors.",
            location="Boulder, CO"
        ),
        User(
            username="stargazer",
            email="stars@example.com",
            image="https://randomuser.me/api/portraits/men/32.jpg",
            bio="Lost in the cosmos.",
            location="Flagstaff, AZ"
        ),
        User(
            username="beachcomber",
            email="beach@example.com",
            image="https://randomuser.me/api/portraits/women/65.jpg",
            bio="Seashells and serenity.",
            location="Santa Barbara, CA"
        ),
        User(
            username="forestwalker",
            email="forest@example.com",
            image="https://randomuser.me/api/portraits/men/77.jpg",
            bio="Among the trees and tranquility.",
            location="Portland, OR"
        )
    ]

    for u in users:
        u.set_password("password123")
        db.session.add(u)

    db.session.commit()

    print("Seeding activities...")
    activities = [
        Activity(
            title="Sunset at Flatirons",
            activity_type="Sunset Watching",
            description="Caught the golden hour hitting the peaks—magical evening.",
            datetime=datetime(2025, 6, 20, 18, 30),
            photos="https://th.bing.com/th/id/OIP.2G7wnXuBOqQAu7rH7Z17lQHaFj?r=0&rs=1&pid=ImgDetMain&cb=idpwebpc2",
            user_id=users[0].id,
            latitude=39.9867,
            longitude=-105.2750,
            location_name="Flatirons, Boulder"
        ),
        Activity(
            title="Stargazing in the Desert",
            activity_type="Stargazing",
            description="Clear night sky, perfect for spotting constellations!",
            datetime=datetime(2025, 6, 21, 21, 15),
            photos="https://th.bing.com/th/id/R.ab9075c87e906424c41aba8dda35d880?rik=Bzt%2bwnY%2f3%2fasHw&pid=ImgRaw&r=0",
            user_id=users[1].id,
            latitude=35.1983,
            longitude=-111.6513,
            location_name="Flagstaff, AZ"
        ),
        Activity(
            title="Seashell Collecting",
            activity_type="Seashell Collecting",
            description="Found some beautiful shells along the shore. Perfect morning.",
            datetime=datetime(2025, 6, 22, 8, 0),
            photos="https://th.bing.com/th/id/R.601975ca38b1f7ab5425333b29d9c625?rik=z85amv8wcNPyQA&riu=http%3a%2f%2fpublicdomainpictures.net%2fpictures%2f130000%2fvelka%2fcollecting-shells-on-the-beach.jpg&ehk=2zIUwbESkAhyJ0vFyJZ3N%2fsbYMGpg5jjFTFXB2RvCK4%3d&risl=&pid=ImgRaw&r=0",
            user_id=users[2].id,
            latitude=34.4208,
            longitude=-119.6982,
            location_name="Santa Barbara Beach"
        ),
        Activity(
            title="Forest Foraging",
            activity_type="Foraging",
            description="Found some wild berries and mushrooms. Nature's bounty!",
            datetime=datetime(2025, 6, 23, 10, 45),
            photos="https://mytoastlife.com/wp-content/uploads/2022/01/AdobeStock_387297682.jpeg",
            user_id=users[3].id,
            latitude=45.5152,
            longitude=-122.6784,
            location_name="Forest Park, Portland"
        )
    ]

    db.session.add_all(activities)
    db.session.commit()

    print("Seeding comments...")
    comments = [
        Comment(
            content="That sunset looks absolutely magical!",
            datetime=datetime.now(),
            activity_id=activities[0].id,
            user_id=users[1].id
        ),
        Comment(
            content="The stars must have been incredible!",
            datetime=datetime.now(),
            activity_id=activities[1].id,
            user_id=users[0].id
        ),
        Comment(
            content="What beautiful shells! I love beachcombing too.",
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

    print("Seeding follows...")
    follows = [
        Follow(follower_id=users[0].id, followed_id=users[1].id),  # naturelover follows stargazer
        Follow(follower_id=users[0].id, followed_id=users[2].id),  # naturelover follows beachcomber
        Follow(follower_id=users[1].id, followed_id=users[0].id),  # stargazer follows naturelover
        Follow(follower_id=users[2].id, followed_id=users[3].id),  # beachcomber follows forestwalker
        Follow(follower_id=users[3].id, followed_id=users[0].id),  # forestwalker follows naturelover
    ]
    db.session.add_all(follows)
    db.session.commit()
    print("✅ Done seeding!")
