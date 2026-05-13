import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { NavLink } from "react-router-dom";
import "../../styling/navbar.css";

const NAV_MENU_ID = "primary-nav-menu";

function NavBar() {
  const { user } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav role="navigation" aria-label="Main navigation">
      <NavLink
        to="/"
        className="nav-brand"
        aria-label="Go to home page"
        onClick={closeMenu}
      >
        Home
      </NavLink>
      <button
        type="button"
        className="hamburger-menu"
        aria-expanded={menuOpen}
        aria-controls={NAV_MENU_ID}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="hamburger-line" aria-hidden />
        <span className="hamburger-line" aria-hidden />
        <span className="hamburger-line" aria-hidden />
      </button>
      <div
        id={NAV_MENU_ID}
        className={menuOpen ? "nav-menu active" : "nav-menu"}
      >
        <NavLink
          to="/activity-feed"
          className="nav-links"
          aria-label="View activity feed"
          onClick={closeMenu}
        >
          Activity Feed
        </NavLink>
        <NavLink
          to="/find-users"
          className="nav-links"
          aria-label="Find other users"
          onClick={closeMenu}
        >
          Find Friends
        </NavLink>
        {user && (
          <>
            <NavLink
              to={`/users/${user.id}`}
              className="nav-links"
              aria-label="View your profile"
              onClick={closeMenu}
            >
              Profile
            </NavLink>
            <NavLink
              to="/logout"
              className="nav-links"
              aria-label="Sign out of your account"
              onClick={closeMenu}
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
            onClick={closeMenu}
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
