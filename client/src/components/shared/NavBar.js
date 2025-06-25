import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { NavLink } from "react-router-dom";
import "../../styling/navbar.css";  

function NavBar() {
    const { user } = useContext(UserContext);

    return (
        <nav>
            <NavLink to="/" className="nav-brand">Home</NavLink>
            <NavLink to="/activity-feed" className="nav-links">Activity Feed</NavLink>
            {user && (
                <NavLink to={`/users/${user.id}`} className="nav-links">Profile</NavLink>
            )}
            {!user && (
                <NavLink to="/login" className="nav-links">Login</NavLink>
            )}
        </nav>
    )
}

export default NavBar;