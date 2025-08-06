import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { getApiUrl } from "../../utils/api";

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
    instagram: user.instagram || "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.image || "");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(getApiUrl("/upload-image"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const result = await response.json();
    return result.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let imageUrl = formData.image;

      // Upload new image if file is selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      // Update profile with new image URL
      const updateData = { ...formData, image: imageUrl };

      const response = await fetch(getApiUrl(`/users/${user.id}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();
      setUser(updatedUser);
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Profile Image:
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: "10px" }}
        />
        {previewUrl && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={previewUrl}
              alt="Profile preview"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #fc4c02",
              }}
            />
          </div>
        )}
      </label>

      <label>
        Bio:
        <textarea name="bio" value={formData.bio} onChange={handleChange} />
      </label>

      <label>
        Location:
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </label>

      <label>
        Website:
        <input
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
      </label>

      <label>
        Twitter:
        <input
          name="twitter"
          value={formData.twitter}
          onChange={handleChange}
        />
      </label>

      <label>
        Instagram:
        <input
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
        />
      </label>

      <div className="form-buttons">
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditProfileForm;
