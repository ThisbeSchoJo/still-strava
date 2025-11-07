import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styling/PasswordResetRequest.css";

function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/request-password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // In development, show the reset link for testing
        if (data.reset_link) {
          setMessage(`${data.message} (For testing: ${data.reset_link})`);
        }
      } else {
        setError(data.error || "Failed to send reset email");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-reset-request">
      <div className="password-reset-request-container">
        <h2>Reset Your Password</h2>
        <p className="password-reset-instructions">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="password-reset-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
            />
          </div>

          {error && (
            <div className="error" role="alert" aria-live="polite">
              <p className="error-message">{error}</p>
            </div>
          )}

          {message && (
            <div className="success" role="alert" aria-live="polite">
              <p className="success-message">{message}</p>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="password-reset-links">
          <p>
            Remember your password?{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </p>
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetRequest;
