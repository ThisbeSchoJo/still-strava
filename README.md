# Still Strava 🌿

A full-stack social fitness application inspired by Strava, built with React and Flask. Still Strava focuses on slow, mindful outdoor activities like hammocking, stargazing, and nature walks - encouraging users to connect with nature and share peaceful moments.

## 🚀 Live Demo

(Coming soon...)

## ✨ Features

### Core Functionality

- **User Authentication**: Sign up, login, and profile management
- **Activity Tracking**: Log outdoor activities with photos, location, and descriptions
- **Social Features**: Like activities, leave comments, and follow other users (follow feature WIP)
- **Interactive Maps**: Google Maps integration for activity locations
- **Photo Galleries**: Upload and display multiple photos per activity
- **User Profiles**: Detailed profiles with activity statistics and bio

### Advanced Features

- **Activity Statistics**: Charts showing weekly activity trends and activity type breakdown
- **Real-time Updates**: Dynamic activity feeds with live like/comment updates
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
- **React Router** - Client-side routing
- **Chart.js** - Interactive charts and statistics
- **Google Maps API** - Location services and mapping
- **CSS3** - Custom styling with responsive design

### Backend

- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database management
- **Flask-Migrate** - Database migration management
- **Flask-CORS** - Cross-origin resource sharing
- **JWT** - JSON Web Token authentication
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
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── comments/   # Comment functionality
│   │   │   ├── friends/    # Social features
│   │   │   ├── shared/     # Shared components
│   │   │   └── users/      # User profile components
│   │   ├── context/        # React context providers
│   │   ├── routes.js       # Application routing
│   │   ├── styling/        # CSS files
│   │   └── utils/          # Utility functions
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

4. **Environment Variables**
   Create a `.env` file in the `client` directory:
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

## 🔧 API Endpoints

### Authentication

- `POST /signup` - User registration
- `POST /login` - User login
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

- `GET /users/:id` - Get user profile
- `PATCH /users/:id` - Update user profile

### Comments

- `GET /comments` - Get comments for activity
- `POST /comments` - Create new comment

## 🎨 Key Components

### ActivityCard

Displays individual activities with photos, maps, likes, and comments. Handles user interactions and real-time updates.

### UserStats

Interactive charts showing activity statistics including weekly trends and activity type breakdown using Chart.js.

### MapPicker

Google Maps integration for selecting activity locations with geocoding and reverse geocoding.

## 🔒 Security Features

- **JWT Authentication**: Secure token-based user sessions
- **Password Hashing**: bcrypt password encryption
- **CORS Configuration**: Proper cross-origin security
- **Input Validation**: Server-side data validation
- **SQL Injection Protection**: SQLAlchemy ORM protection

## 📱 Mobile Optimization

- **Responsive Design**: Mobile-first CSS approach
- **Touch Targets**: Properly sized interactive elements
- **Mobile Navigation**: Optimized navigation for mobile devices
- **Image Optimization**: Responsive images and lazy loading

## ♿ Accessibility Features

- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indicators
- **Semantic HTML**: Proper HTML structure
- **Color Contrast**: WCAG compliant color schemes

## 🙏 Acknowledgments

- **Strava** - Inspiration for the social fitness concept
- **React Team** - Amazing frontend framework
- **Flask Team** - Robust Python web framework
- **Chart.js** - Beautiful charting library
- **Google Maps** - Location services

---

**Still Strava** - Connecting people with nature, one peaceful moment at a time. 🌿
