const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary using CLOUDINARY_URL or explicit creds
// Example: CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
function ensureConfigured() {
  if (!cloudinary.config().cloud_name) {
    const { CLOUDINARY_URL } = process.env;
    if (!CLOUDINARY_URL) {
      throw new Error('CLOUDINARY_URL is not set in environment');
    }
    // cloudinary v2 will auto-read CLOUDINARY_URL from env; call config to lock
    cloudinary.config({ secure: true });
  }
}

/**
 * Upload a buffer to Cloudinary via upload_stream
 * @param {Buffer} buffer - file buffer
 * @param {Object} options - cloudinary options (folder, resource_type, public_id, etc.)
 * @returns {Promise<{url: string, secure_url: string, public_id: string, resource_type: string}>}
 */
function uploadBuffer(buffer, options = {}) {
  ensureConfigured();
  const resourceType = options.resource_type || 'auto';
  const folder = options.folder || 'connunity/uploads';

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, overwrite: true },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

/**
 * Upload a data URI or remote/local path using cloudinary.uploader.upload
 */
async function uploadSource(src, options = {}) {
  ensureConfigured();
  const resourceType = options.resource_type || 'auto';
  const folder = options.folder || 'connunity/uploads';
  return cloudinary.uploader.upload(src, { folder, resource_type: resourceType, overwrite: true });
}

module.exports = {
  uploadBuffer,
  uploadSource,
};
