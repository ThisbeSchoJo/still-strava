# Still Strava 🌿

A full-stack social fitness application inspired by Strava, built with React and Flask. Still Strava focuses on slow, mindful outdoor activities like hammocking, stargazing, and nature walks - encouraging users to connect with nature and share peaceful moments.

## 🚀 Live Demo

(Coming soon...)

## ✨ Features

### Core Functionality

- **User Authentication**: Sign up, login, and profile management with JWT tokens
- **Activity Tracking**: Log outdoor activities with photos, location, duration, and descriptions
- **Social Features**: Like activities, leave comments, and follow other users
- **Interactive Maps**: Google Maps integration for activity locations (requires API key setup)
- **Photo Galleries**: Upload and display multiple photos per activity
- **User Profiles**: Detailed profiles with activity statistics, bio, and social links
- **Badge System**: Earn badges for achievements like activity counts, diversity, and social engagement

### Advanced Features

- **Activity Statistics**: Interactive charts showing weekly activity trends, activity type breakdown, and calendar heatmap
- **Real-time Updates**: Dynamic activity feeds with live like/comment updates
- **Follow System**: Follow/unfollow users with followers/following lists
- **Mobile Responsive**: Optimized for mobile and desktop use
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Error Handling**: Graceful error handling with user-friendly messages

### Technical Features

- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Clean, well-documented backend API
- **Database Migrations**: Alembic migrations for database schema management
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Secure configuration management

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **React Router v6** - Client-side routing
- **Chart.js v4** - Interactive charts and statistics
- **Google Maps API** - Location services and mapping
- **CSS3** - Custom styling with responsive design
- **React Icons** - Icon library for UI elements

### Backend

- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database management
- **Flask-Migrate** - Database migration management
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-JWT-Extended** - JWT authentication
- **bcrypt** - Password hashing
- **SQLite** - Lightweight database (development)

### Deployment

- **Vercel** - Frontend hosting (eventually)
- **Railway** - Backend hosting (eventually)
- **GitHub** - Version control

## 📁 Project Structure

```
still-strava/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── activities/ # Activity-related components
│   │   │   │   ├── ActivityCard.js      # Individual activity display
│   │   │   │   ├── ActivityForm.js      # Create/edit activities
│   │   │   │   ├── ActivityList.js      # Activity feed
│   │   │   │   └── ActivitiyDetail.js   # Activity detail view
│   │   │   ├── auth/       # Authentication components
│   │   │   │   ├── Login.js             # User login
│   │   │   │   ├── SignUp.js            # User registration
│   │   │   │   └── Logout.js            # User logout
│   │   │   ├── comments/   # Comment functionality
│   │   │   │   ├── CommentForm.js       # Comment creation
│   │   │   │   └── CommentList.js       # Comment display
│   │   │   ├── friends/    # Social features
│   │   │   │   ├── FriendList.js        # Friends list
│   │   │   │   └── FriendProfile.js     # Friend profiles
│   │   │   ├── shared/     # Shared components
│   │   │   │   ├── MapPicker.js         # Location selection
│   │   │   │   ├── MapDisplay.js        # Location display
│   │   │   │   ├── NavBar.js            # Navigation
│   │   │   │   ├── Badges.js            # Badge display component
│   │   │   │   └── ErrorPage.js         # Error handling
│   │   │   └── users/      # User profile components
│   │   │       ├── UserProfile.js       # User profile display
│   │   │       ├── UserProfilePage.js   # Profile page wrapper
│   │   │       ├── UserStats.js         # Activity statistics
│   │   │       ├── EditProfileForm.js   # Profile editing
│   │   │       ├── FollowersList.js     # Followers modal
│   │   │       ├── FollowingList.js     # Following modal
│   │   │       └── UserList.js          # User discovery
│   │   ├── context/        # React context providers
│   │   │   └── UserContext.js           # User authentication state
│   │   ├── routes.js       # Application routing
│   │   ├── styling/        # CSS files
│   │   └── utils/          # Utility functions
│   │       ├── api.js      # API configuration
│   │       ├── activityIcons.js # Activity type icons
│   │       └── badges.js   # Badge system logic
│   └── package.json
├── server/                 # Flask backend
│   ├── app.py             # Main Flask application
│   ├── config.py          # Flask configuration
│   ├── models.py          # SQLAlchemy models
│   ├── seed.py            # Database seeding
│   └── migrations/        # Database migrations
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- pipenv

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ThisbeSchoJo/still-strava.git
   cd still-strava
   ```

2. **Backend Setup**

   ```bash
   cd server
   pipenv install
   pipenv shell
   flask db upgrade head
   python seed.py
   python app.py
   ```

   The backend will run on `http://localhost:5555`

3. **Frontend Setup**

   ```bash
   cd client
   npm install
   npm start
   ```

   The frontend will run on `http://localhost:3000`

4. **Environment Variables** (Optional)
   Create a `.env` file in the `client` directory for Google Maps integration:
   ```env
   REACT_APP_API_URL=http://localhost:5555
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

## 📊 Database Schema

### Users

- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `image` (Profile picture URL)
- `bio`, `location`, `website`, `twitter`, `instagram`

### Activities

- `id` (Primary Key)
- `title`, `description`, `activity_type`
- `location_name`, `latitude`, `longitude`
- `photos` (Comma-separated URLs)
- `song` (Associated music)
- `datetime`, `created_at`, `updated_at`
- `elapsed_time` (Duration in seconds)
- `user_id` (Foreign Key)

### Comments

- `id` (Primary Key)
- `content`
- `datetime`
- `user_id` (Foreign Key)
- `activity_id` (Foreign Key)

### Likes

- `id` (Primary Key)
- `user_id` (Foreign Key)
- `activity_id` (Foreign Key)
- `created_at`

### Follows

- `id` (Primary Key)
- `follower_id` (Foreign Key to Users)
- `followed_id` (Foreign Key to Users)
- Unique constraint on follower_id + followed_id

## 🔧 API Endpoints

### Authentication

- `POST /login` - User login
- `POST /signup` - User registration
- `GET /me` - Get current user info

### Activities

- `GET /activities` - Get all activities
- `POST /activities` - Create new activity
- `GET /activities/:id` - Get specific activity
- `PATCH /activities/:id` - Update activity
- `DELETE /activities/:id` - Delete activity
- `POST /activities/:id/like` - Like activity
- `DELETE /activities/:id/unlike` - Unlike activity

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user profile
- `PATCH /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user

### Comments

- `GET /comments` - Get comments for activity
- `POST /comments` - Create new comment
- `GET /comments/:id` - Get specific comment
- `PATCH /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

### Social Features

- `POST /users/:id/follow` - Follow user
- `DELETE /users/:id/unfollow` - Unfollow user
- `GET /users/:id/followers` - Get user's followers
- `GET /users/:id/following` - Get users being followed

## 🎨 Key Components

### ActivityCard

Displays individual activities with photos, maps, likes, and comments. Handles user interactions and real-time updates.

### UserStats

Interactive charts showing activity statistics including:

- **Weekly Activity Line Chart**: Shows activity trends over time
- **Activity Types Pie Chart**: Breakdown of activity types
- **Activity Calendar Heatmap**: Visual calendar showing activity days with intensity based on duration

### Badges

Comprehensive badge system with:

- **Activity Count Badges**: First Steps, Explorer, Adventurer, Nature Master
- **Activity Type Badges**: Stargazer, Hammock Master, Bird Watcher, Sunset Chaser
- **Duration Badges**: Patient Observer, Meditation Master, Time Investor
- **Social Badges**: Social Butterfly, Nature Influencer, Community Commenter
- **Location Badges**: Local Explorer, Nature Traveler
- **Diversity Badges**: Activity Explorer, Activity Master
- **Time-based Badges**: Early Bird, Night Owl

### MapPicker

Google Maps integration for selecting activity locations with geocoding and reverse geocoding.

### FollowersList/FollowingList

Modal components for displaying user followers and following lists with follow/unfollow functionality.

## 🔒 Security Features

- **JWT Authentication**: Secure token-based user sessions
- **Password Hashing**: bcrypt password encryption
- **CORS Configuration**: Proper cross-origin security
- **Input Validation**: Server-side data validation
- **SQL Injection Protection**: SQLAlchemy ORM protection

## 📱 Mobile Optimization

- **Responsive Design**: Mobile-first CSS approach
- **Touch Targets**: Properly sized interactive elements (44px minimum)
- **Mobile Navigation**: Optimized navigation for mobile devices
- **Image Optimization**: Responsive images and lazy loading

## ♿ Accessibility Features

- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indicators
- **Semantic HTML**: Proper HTML structure
- **Color Contrast**: WCAG compliant color schemes

## 🌟 Recent Updates

### Enhanced User Experience

- **Activity Duration Tracking**: Hours and minutes input with validation
- **Improved Comments**: Better spacing and visual hierarchy
- **Enhanced Home Page**: Added inspiration section explaining the app's story
- **Better Activity Sorting**: Activities now display from most recent to least recent
- **Badge System**: Complete achievement system with earned/unearned states

### Visual Improvements

- **Consistent Chart Styling**: All chart titles now match the "Activity Calendar" styling
- **Line Chart**: Replaced scatter plot with line chart for better trend visualization
- **Responsive Stats**: Charts stack vertically on mobile devices
- **Clean Tooltips**: Simplified pie chart tooltips to show only activity type names
- **Badge Display**: Clean badge grid with toggle between earned and all badges

### Social Features

- **Follow System**: Complete follow/unfollow functionality with modal displays
- **Followers/Following Lists**: Modal components for viewing social connections
- **Enhanced User Profiles**: Better activity statistics and social information

## 🙏 Acknowledgments

- **Strava** - Inspiration for the social fitness concept
- **React Team** - Amazing frontend framework
- **Flask Team** - Robust Python web framework
- **Chart.js** - Beautiful charting library
- **Google Maps** - Location services

---

**Still Strava** - Connecting people with nature, one peaceful moment at a time. 🌿
