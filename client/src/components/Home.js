import "../styling/home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="homepage">
      <h2>Welcome to Still Strava</h2>
      <p className="subtitle">Go outside and log your time</p>
      <p className="description">
        Discover the joy of slow outdoor activities - from hammocking to
        stargazing
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
  );
}

export default Home;
