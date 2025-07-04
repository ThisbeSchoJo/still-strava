import "../../styling/activityform.css";

function ActivityForm() {
  return (
    <div className="activity-form-container">
      <div className="activity-form-header">
        <h1>Create New Activity</h1>
        <p>Share your outdoor adventure with the community</p>
      </div>

      <form className="activity-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Give your activity a catchy title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_type">Activity Type</label>
          <select id="activity_type" name="activity_type">
            <option value="">Select an activity type</option>
            <option value="Hammocking">Hammocking</option>
            <option value="Rockhounding">Rockhounding</option>
            <option value="Sunset Watching">Sunset Watching</option>
            <option value="Sunrise Watching">Sunrise Watching</option>
            <option value="Camping">Camping</option>
            <option value="Foraging">Foraging</option>
            <option value="Stargazing">Stargazing</option>
            <option value="Bird Watching">Bird Watching</option>
            <option value="Wood carving">Wood carving</option>
            <option value="Seashell Collecting">Seashell Collecting</option>
            <option value="Fossil Hunting">Fossil Hunting</option>
            <option value="Fishing">Fishing</option>
            <option value="Picnicking">Picnicking</option>
            <option value="Mycology Walk">Mycology Walk</option>
            <option value="Outdoor Reading">Outdoor Reading</option>
            <option value="Campfire">Campfire</option>
            <option value="Bioblitzing">Bioblitzing</option>
            <option value="Catching fireflies">Catching fireflies</option>
            <option value="Tidepooling">Tidepooling</option>
            <option value="Building a sandcastle">Building a sandcastle</option>
            <option value="Building a snowman">Building a snowman</option>
            <option value="Skipping stones">Skipping stones</option>
            <option value="Catching amphibians and reptiles">
              Catching amphibians and reptiles
            </option>
            <option value="Gardening">Gardening</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Tell us about your adventure..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="photos">Photo URL</label>
          <input
            type="text"
            id="photos"
            name="photos"
            placeholder="Add a photo URL (optional)"
          />
        </div>

        <div className="activity-form-buttons">
          <button type="submit" className="submit-button">
            Create Activity
          </button>
          <button type="button" className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ActivityForm;
