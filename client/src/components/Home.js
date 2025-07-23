import "../styling/home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-icon">🌿</div>
        <h2>Welcome to Still Strava</h2>
        <p className="subtitle">Go outside and log your time</p>
        <p className="description">
          Discover the joy of slow outdoor activities - from hammocking to
          stargazing, connect with nature and share peaceful moments with
          others.
        </p>
        <div className="cta-buttons">
          <Link to="/activity-feed" className="cta-button primary">
            Explore Activities
          </Link>
          <Link to="/signup" className="cta-button secondary">
            Join Community
          </Link>
        </div>
      </div>

      <div className="inspiration-section">
        <h3>The Story Behind Still Strava</h3>
        <div className="inspiration-content">
          <p>
            I've always loved Strava - the way it connects athletes, celebrates
            achievements, and builds community around physical activity. But
            when I broke my ankle and couldn't run, bike, or do the
            high-intensity activities I was used to, I found myself missing that
            sense of connection and outdoor engagement.
          </p>
          <p>
            Still Strava was born from that experience. I wanted to create a
            space where people could connect with others and spend time
            outdoors, but in a more accessible way. Whether you're recovering
            from an injury, prefer slower activities, or just want to celebrate
            the peaceful moments in nature, this is a place for you.
          </p>
          <p>
            Here, we track the quiet activities that bring us closer to nature -
            hammocking, stargazing, bird watching, or simply sitting by a lake.
            It's about finding joy in the stillness and sharing those moments
            with others who understand.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
