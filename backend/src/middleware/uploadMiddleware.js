import crypto from 'crypto';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname) || '.jpg';
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('only image uploads are allowed'));
  }

  return cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const getUploadedFileUrl = (req, file) =>
  `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

export const removeUploadedFile = async (file) => {
  if (!file?.path) {
    return;
  }

  await fs.promises.unlink(file.path).catch(() => {});
};

export default upload;
