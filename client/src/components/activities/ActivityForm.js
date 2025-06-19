
function ActivityForm() {
    return (
        <div>
            <h1>Activity Form</h1>
            <form>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" />
                </div>
                <div>
                    <label htmlFor="activity_type">Activity Type</label>
                    <select id="activity_type" name="activity_type">
                        {/* TODO: Add activity types */}
                    </select>
                </div>
                <button type="submit">Create Activity</button>
            </form>
        </div>
    )
}

export default ActivityForm;