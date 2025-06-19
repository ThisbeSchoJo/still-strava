import "../../styling/navbar.css";  
import { NavLink } from "react-router-dom";


function NavBar() {
    return (
        <nav>
            <NavLink to="/" className="nav-brand">Home</NavLink>
            <NavLink to="/activity-feed" className="nav-links">Activity Feed</NavLink>
            <NavLink to="/users/:id" className="nav-links">Profile</NavLink>
            <NavLink to="/login" className="nav-links">Login</NavLink>
        </nav>
    )
}

export default NavBar;