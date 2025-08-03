import { useState } from "react";
import "../../styling/activityform.css";

/**
 * DragDropZone Component
 *
 * Handles drag and drop file upload UI:
 * - Drag and drop visual feedback
 * - File input button
 * - File selection handling
 *
 * @param {Object} props
 * @param {Function} props.onFileSelect - Callback when a file is selected
 */
function DragDropZone({ onFileSelect }) {
  const [isDragOver, setIsDragOver] = useState(false);

  /**
   * Handles file drop events
   * @param {DragEvent} e - The drop event
   */
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  /**
   * Handles drag over events
   * @param {DragEvent} e - The drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  /**
   * Handles drag leave events
   * @param {DragEvent} e - The drag leave event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  /**
   * Handles file input change
   * @param {Event} e - The file input change event
   */
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
    // Reset the input
    e.target.value = "";
  };

  return (
    <div
      className={`drag-drop-zone ${isDragOver ? "drag-over" : ""}`}
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="drag-drop-content">
        <span className="drag-drop-icon">📁</span>
        <p className="drag-drop-text">
          {isDragOver ? "Drop image here!" : "Drag image files here"}
        </p>
        <p className="drag-drop-subtext">or</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          id="file-input"
        />
        <button
          type="button"
          onClick={() => document.getElementById("file-input").click()}
          className="file-input-button"
        >
          Choose File
        </button>
      </div>
    </div>
  );
}

export default DragDropZone;
