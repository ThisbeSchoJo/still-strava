import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function Logout() {
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        setUser(null);                          // Clear user from context
        localStorage.removeItem("token");       // Remove token
        navigate("/login");                     // Redirect to login
    }, [setUser, navigate]);
    
    return <p>Logging out...</p>; // Optional: replace with loading spinner
}

export default Logout;