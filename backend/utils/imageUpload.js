import path from 'path';

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/x-png',
  'image/webp',
]);

const normalizeMimeType = (mimetype = '') => mimetype.toLowerCase().trim();

const isAllowedImageFile = (file = {}) => {
  const extension = path.extname(file.originalname || '').toLowerCase();
  const mimeType = normalizeMimeType(file.mimetype || '');
  const normalizedMimeType = mimeType === 'image/jpg' ? 'image/jpeg' : mimeType;

  if (!allowedExtensions.has(extension)) {
    return false;
  }

  return !normalizedMimeType || allowedMimeTypes.has(normalizedMimeType);
};

const getImageUploadErrorMessage = () => 'Format rejected. Only JPEG, PNG, and WEBP images are allowed!';

export { isAllowedImageFile, getImageUploadErrorMessage };
