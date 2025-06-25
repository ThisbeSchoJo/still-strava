import "../../styling/signup.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function SignUp() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(""); // default to blank or ask user
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    fetch("http://localhost:5555/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, image }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Signup failed");
        return res.json();
      })
      .then((data) => {
        setUser(data.user); // save user in context
        localStorage.setItem("token", data.token); // save token
        navigate(`/users/${data.user.id}`); // redirect to profile
      })
      .catch((err) => {
        console.error("Signup error:", err);
        setError("Signup failed. Try again.");
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h1>Create Account</h1>
        <p>Join our community</p>
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" id="username" value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type="password" id="confirmPassword" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Profile Image URL</label>
          <input 
            type="text" id="image" value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Optional image URL" 
          />
        </div>

        <button type="submit" className="signup-button">
          Create Account
        </button>
      </form>

      <div className="signup-footer">
        <p>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
