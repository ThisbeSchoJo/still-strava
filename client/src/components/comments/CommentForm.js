import "../../styling/commentform.css";

function CommentForm() {
    return (
        <div>
            <h1>Comment Form</h1>
            <form>
                <div>
                    <label htmlFor="content">Content</label>
                    <textarea id="content" name="content" />
                </div>
                <button type="submit">Create Comment</button>
            </form>
        </div>
    )
}

export default CommentForm;