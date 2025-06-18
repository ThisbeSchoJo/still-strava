import { NavLink } from "react-router-dom";

function NavBar() {
    return (
        <nav>
            <NavLink>Home</NavLink>
            <NavLink>Activity Feed</NavLink>
        </nav>
    )
}

export default NavBar;