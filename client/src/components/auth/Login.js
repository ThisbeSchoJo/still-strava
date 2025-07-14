import "../../styling/login.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { getApiUrl } from "../../utils/api";

function Login() {
  const { setUser } = useContext(UserContext); // grab setUser from context
  const navigate = useNavigate(); // for redirecting
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent form reload
    setError(null);

    fetch(getApiUrl("/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid email or password");
        return res.json();
      })
      .then((data) => {
        setUser(data.user); // ✅ store user in context
        localStorage.setItem("token", data.token); // ✅ store token if you want
        navigate(`/users/${data.user.id}`); // ✅ redirect to profile
      })
      .catch((err) => {
        console.error("Login error:", err);
        setError(err.message);
      });
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Welcome Back</h1>
        <p>Sign in to continue</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>

      <div className="login-footer">
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
