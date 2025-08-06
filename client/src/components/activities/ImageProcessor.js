/**
 * ImageProcessor Component
 *
 * Handles image file processing and compression:
 * - File type validation
 * - Image compression with canvas
 * - Data URL conversion
 * - Error handling for unsupported formats
 *
 * @param {File} file - The image file to process
 * @param {Function} onSuccess - Callback with compressed data URL
 * @param {Function} onError - Callback for processing errors
 */
function ImageProcessor(file, onSuccess, onError) {
  // Check if it's a supported image type
  if (
    !file.type.startsWith("image/") ||
    file.name.toLowerCase().endsWith(".heic")
  ) {
    const errorMessage = file.name.toLowerCase().endsWith(".heic")
      ? "HEIC files are not supported by web browsers. Please convert your image to JPEG or PNG format."
      : `"${file.name}" is not a supported image file. Please select a JPEG, PNG, GIF, or WebP file.`;
    onError(errorMessage);
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // Create a canvas to compress the image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set maximum dimensions (800x600 for reasonable file size)
      const maxWidth = 800;
      const maxHeight = 600;

      let { width, height } = img;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw the compressed image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to data URL with compression (0.8 quality for good balance)
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);

      onSuccess(compressedDataUrl);
    };

    img.onerror = (error) => {
      onError("Failed to process image. Please try again.");
    };

    img.src = event.target.result;
  };

  reader.onerror = (error) => {
    onError("Failed to read file. Please try again.");
  };

  reader.readAsDataURL(file);
}

export default ImageProcessor;
