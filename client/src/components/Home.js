import "../styling/home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="homepage">
      <h2>Welcome to Still Strava</h2>
      <p>Go outside and log your time</p>
      <Link to="/activity-feed" className="cta-button primary">
        Explore Activities
      </Link>
    </div>
  );
}

export default Home;
