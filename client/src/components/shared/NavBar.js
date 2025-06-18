import "../../styling/navbar.css";  
import { NavLink } from "react-router-dom";


function NavBar() {
    return (
        <nav>
            <NavLink to="/" className="nav-brand">Home</NavLink>
            <NavLink to="/activity-feed" className="nav-links">Activity Feed</NavLink>
        </nav>
    )
}

export default NavBar;