# Still Strava - Developer Q&A

_Technical insights and implementation details for developers exploring this codebase_

## 🏗️ **Architecture & Tech Stack**

### Q: What's the overall architecture of this application?

**A:** Full-stack web app with React frontend and Flask backend. The frontend (port 3000) communicates with the backend API (port 5555) via RESTful endpoints. Uses JWT authentication and SQLAlchemy ORM with PostgreSQL in production.

### Q: Why did you choose this tech stack?

**A:**

- **React**: Component reusability, strong ecosystem, modern development experience
- **Flask**: Python's readability, rapid development, excellent ORM with SQLAlchemy
- **SQLAlchemy**: Type-safe database operations with relationship management
- **JWT**: Stateless authentication, scalable, works well with SPAs
- **Railway**: Easy deployment with built-in PostgreSQL

### Q: How is the project structured?

**A:**

```
still-strava/
├── client/          # React frontend
│   ├── src/components/    # Feature-based component organization
│   ├── src/context/       # React Context for global state
│   └── src/utils/         # API utilities and helpers
└── server/          # Flask backend
    ├── app.py       # Main Flask app with RESTful API
    ├── models.py    # SQLAlchemy models with relationships
    └── migrations/  # Database schema versioning
```

## 🗄️ **Database Design**

### Q: What's your database schema like?

**A:** 5 core models with proper relationships:

- **Users**: Authentication, profiles, social links
- **Activities**: Posts with photos, location, duration, type
- **Comments**: Activity comments with timestamps
- **Likes**: Many-to-many relationship between users and activities
- **Follows**: Self-referential many-to-many for user following

### Q: How do you handle database relationships?

**A:** SQLAlchemy relationships with cascade deletes. The Follow model uses a junction table with `follower_id` and `followed_id` foreign keys. Activities have proper foreign keys to users, and comments/likes reference both users and activities.

### Q: How do you avoid N+1 query problems?

**A:** Use SQLAlchemy's `joinedload()` and `selectinload()` for eager loading. The `get_activity_with_likes()` function efficiently loads like counts and user's like status in single queries.

## 🔐 **Authentication & Security**

### Q: How does authentication work?

**A:** JWT-based stateless authentication. Users get a token on login, which is stored in localStorage and sent with API requests. The backend validates tokens and extracts user info.

### Q: How do you handle password security?

**A:** bcrypt hashing for passwords. Never store plain text passwords - they're hashed before database storage and compared using bcrypt's verify function.

### Q: How do you secure file uploads?

**A:**

- Type validation (images only)
- Size limits (client and server-side)
- Secure filename generation (UUIDs)
- Server-side validation before storage

## ⚛️ **Frontend Implementation**

### Q: How do you manage state in React?

**A:** React Context for global user state (authentication), local useState for component-specific data. No Redux needed for this scale - Context provides clean global state management.

### Q: How do you handle real-time updates without WebSockets?

**A:** State management pattern where child components (like ActivityActionButtons) update parent component state. When a user likes an activity, the parent's activities array is updated, causing re-renders with new like counts.

### Q: How does the photo upload system work?

**A:**

- Drag & drop interface with HTML5 File API
- Client-side image compression using Canvas
- Preview cards with delete functionality
- Multiple photo support per activity

### Q: How do you handle Google Maps integration?

**A:** Google Maps JavaScript API loaded in index.html. MapPicker component creates interactive maps for location selection with geocoding. MapDisplay shows read-only activity locations.

## 🎨 **Advanced Features**

### Q: How do you implement the statistics charts?

**A:** Chart.js library with three chart types:

- **Line chart**: Weekly activity trends
- **Pie chart**: Activity type breakdown
- **Calendar heatmap**: Activity frequency visualization

### Q: How does the follow system work?

**A:** Backend filtering based on user's following list. The activity feed queries activities where `user_id IN (followed_user_ids)`. Follow/unfollow updates the Follows junction table.

### Q: How do you handle image compression?

**A:** Client-side compression before upload:

```javascript
// Canvas-based resizing and quality adjustment
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
// Resize and compress before upload
```

## 🚀 **Deployment & Production**

### Q: How is this deployed?

**A:**

- **Frontend**: Railway with static file serving (serve package)
- **Backend**: Railway with Gunicorn WSGI server
- **Database**: PostgreSQL provided by Railway
- **Environment**: Proper environment variable management

### Q: How do you handle CORS?

**A:** Flask-CORS configured with allowed origins:

- `http://localhost:3000` for development
- `FRONTEND_URL` environment variable for production
- Supports credentials for authenticated requests

### Q: How do you manage environment variables?

**A:**

- **Backend**: `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`, `FRONTEND_URL`
- **Frontend**: `REACT_APP_API_URL`, `REACT_APP_GOOGLE_MAPS_API_KEY`
- Railway automatically injects these in production

## 🐛 **Common Issues & Solutions**

### Q: How do you handle authentication token expiration?

**A:** Automatic logout on invalid tokens. The frontend checks for 401 responses and redirects to login, clearing stored tokens.

### Q: How do you prevent memory leaks in React?

**A:** Proper cleanup in useEffect hooks, especially for event listeners and timers. Use dependency arrays correctly to avoid infinite re-renders.

### Q: How do you handle database migrations in production?

**A:** Alembic migrations run automatically on app startup in production. The `config.py` includes migration logic that runs when the app starts.

### Q: How do you handle large image uploads?

**A:** Client-side compression reduces file sizes before upload. Server validates file types and sizes, then stores with secure UUID filenames.

## 🔧 **Development Workflow**

### Q: How do you handle API errors?

**A:** Consistent error handling:

- **Frontend**: Try-catch blocks, loading states, user-friendly messages
- **Backend**: Proper HTTP status codes, database rollbacks, input validation

### Q: How do you ensure code quality?

**A:**

- ESLint configuration for consistent code style
- Proper component organization and naming
- Comprehensive error handling throughout the stack
- Clean separation of concerns

### Q: How would you scale this application?

**A:**

- **Database**: Add proper indexing, connection pooling
- **Storage**: Move to cloud storage (AWS S3) for images
- **Caching**: Redis for frequently accessed data
- **Monitoring**: Add logging and performance metrics
- **Load Balancing**: Multiple server instances

## 🎯 **Key Implementation Details**

### Q: How do you handle user search?

**A:** Real-time filtering with debounced API calls. Backend provides fuzzy search by username, frontend filters results and excludes current user.

### Q: How do you implement the badge system?

**A:** Achievement logic in `utils/badges.js` with earned/unearned states. Badges are calculated based on user activity counts, types, duration, and social engagement.

### Q: How do you handle responsive design?

**A:** Mobile-first CSS approach with flexible layouts. Charts stack vertically on mobile, navigation adapts to screen size, touch targets meet accessibility standards.

---

_This Q&A covers the technical implementation details that other developers would find most useful when exploring or contributing to this codebase._
