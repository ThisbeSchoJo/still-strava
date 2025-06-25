import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";

import "../../styling/editprofileform.css";


function EditProfileForm({ user, onClose }) {
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    image: user.image || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    twitter: user.twitter || "",
    instagram: user.instagram || ""
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    fetch(`http://localhost:5555/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update profile");
        return res.json();
      })
      .then((updatedUser) => {
        setUser(updatedUser);        // update context
        onClose();                   // close form
      })
      .catch((err) => {
        console.error("Profile update failed:", err);
        setError("Failed to update profile. Please try again.");
      });
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <label>
        Username:
        <input name="username" value={formData.username} onChange={handleChange} />
      </label>

      <label>
        Email:
        <input name="email" value={formData.email} onChange={handleChange} />
      </label>

      <label>
        Profile Image URL:
        <input name="image" value={formData.image} onChange={handleChange} />
      </label>

      <label>
        Bio:
        <input name="bio" value={formData.bio} onChange={handleChange} />
      </label>

      <label>
        Location:
        <input name="location" value={formData.location} onChange={handleChange} />
      </label>

      <label>
        Website:
        <input name="website" value={formData.website} onChange={handleChange} />
      </label>

      <label>
        Twitter:
        <input name="twitter" value={formData.twitter} onChange={handleChange} />
      </label>

      <label>
        Instagram:
        <input name="instagram" value={formData.instagram} onChange={handleChange} />
      </label>

      <div className="form-buttons">
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
}

export default EditProfileForm;
