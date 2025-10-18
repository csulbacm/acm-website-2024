import { v2 as cloudinary } from 'cloudinary';

// One-time, robust configuration for Cloudinary
let configured = false;
function ensureConfigured() {
  if (configured) return;
  try {
    if (process.env.CLOUDINARY_URL) {
      // Prefer single URL; supports cloudinary://<api_key>:<api_secret>@<cloud_name>
      cloudinary.config(process.env.CLOUDINARY_URL);
    } else {
      const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
      const api_key = process.env.CLOUDINARY_API_KEY;
      const api_secret = process.env.CLOUDINARY_API_SECRET;
      cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
    }
  } catch (e) {
    // noop; we'll validate below
  }
  const cfg = cloudinary.config();
  if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
    // Provide a clear error to aid setup without leaking secrets
    const details = {
      cloud_name_present: Boolean(process.env.CLOUDINARY_CLOUD_NAME) || Boolean(process.env.CLOUDINARY_URL),
      api_key_present: Boolean(process.env.CLOUDINARY_API_KEY) || Boolean(process.env.CLOUDINARY_URL),
      api_secret_present: Boolean(process.env.CLOUDINARY_API_SECRET) || Boolean(process.env.CLOUDINARY_URL),
    };
    console.error('Cloudinary not configured: missing credentials', details);
  } else {
    configured = true;
  }
}

export async function uploadImage(imageData, { folder = 'acm', publicId } = {}) {
  ensureConfigured();
  if (!imageData) return { url: null, public_id: null };
  // If it's already a URL, don't upload again
  if (typeof imageData === 'string' && /^https?:\/\//i.test(imageData)) {
    return { url: imageData, public_id: null };
  }
  // Support data URLs
  if (typeof imageData === 'string' && imageData.startsWith('data:')) {
    const res = await cloudinary.uploader.upload(imageData, {
      folder,
      public_id: publicId,
      resource_type: 'image',
      overwrite: true,
    });
    return { url: res.secure_url, public_id: res.public_id };
  }
  // Fallback: return as-is
  return { url: imageData, public_id: null };
}

export async function deleteImage(publicId) {
  ensureConfigured();
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    // swallow errors to avoid blocking app logic
    return null;
  }
}
