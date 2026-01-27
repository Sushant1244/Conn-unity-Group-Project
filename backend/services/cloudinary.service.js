const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary using CLOUDINARY_URL or explicit creds
// Example: CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
function ensureConfigured() {
  // Prefer explicit envs if provided, else fall back to CLOUDINARY_URL
  const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_URL
  } = process.env;

  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });
    return;
  }

  if (CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
    return;
  }

  throw new Error('Cloudinary credentials missing: set CLOUDINARY_URL or explicit CLOUDINARY_* envs');
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
      {
        folder,
        resource_type: resourceType,
        overwrite: true,
        transformation: [
          { quality: 'auto:good', fetch_format: 'auto' }
        ]
      },
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
  return cloudinary.uploader.upload(src, {
    folder,
    resource_type: resourceType,
    overwrite: true,
    transformation: [
      { quality: 'auto:good', fetch_format: 'auto' }
    ]
  });
}

module.exports = {
  uploadBuffer,
  uploadSource,
};
