// Image and Local File Storage helper for IndexedDB

const StorageManager = {
  /**
   * Converts a File object from an <input type="file"> to a base64 Data URL
   * @param {File} file
   * @returns {Promise<string>}
   */
  fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve('');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  },

  /**
   * Validates if a file is an acceptable image (JPEG, PNG, WebP)
   * @param {File} file
   * @param {number} maxSizeBytes
   * @returns {{ valid: boolean, error?: string }}
   */
  validateImage(file, maxSizeBytes = 5 * 1024 * 1024) {
    if (!file) return { valid: false, error: 'No file provided' };
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!acceptedTypes.includes(file.type)) {
      return { valid: false, error: 'File format is not supported. Please upload a PNG or JPEG image.' };
    }
    if (file.size > maxSizeBytes) {
      return { valid: false, error: 'File size exceeds maximum allowed limit (5MB).' };
    }
    return { valid: true };
  },

  /**
   * Helper equivalent to PHP's validate_image($path)
   * Returns valid URL for an image path, resolving relative paths or returning default logo
   */
  getImageUrl(path, defaultLogo = 'uploads/logo.png', rootPrefix = '') {
    if (!path) return rootPrefix + defaultLogo;
    if (path.startsWith('data:') || path.startsWith('blob:') || path.startsWith('http:') || path.startsWith('https:')) {
      return path;
    }
    // Clean query parameters like ?v=123
    const cleanPath = path.split('?')[0];
    return rootPrefix + cleanPath;
  }
};

if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}

