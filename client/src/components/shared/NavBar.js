import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { NavLink } from "react-router-dom";
import "../../styling/navbar.css";

function NavBar() {
  const { user } = useContext(UserContext);

  return (
    <nav role="navigation" aria-label="Main navigation">
      <NavLink to="/" className="nav-brand" aria-label="Go to home page">
        Home
      </NavLink>
      <NavLink
        to="/activity-feed"
        className="nav-links"
        aria-label="View activity feed"
      >
        Activity Feed
      </NavLink>
      {user && (
        <>
          <NavLink
            to={`/users/${user.id}`}
            className="nav-links"
            aria-label="View your profile"
          >
            Profile
          </NavLink>
          <NavLink
            to="/logout"
            className="nav-links"
            aria-label="Sign out of your account"
          >
            Logout
          </NavLink>
        </>
      )}
      {!user && (
        <NavLink
          to="/login"
          className="nav-links"
          aria-label="Sign in to your account"
        >
          Login
        </NavLink>
      )}
    </nav>
  );
}

export default NavBar;
