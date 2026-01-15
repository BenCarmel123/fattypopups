// Multer configuration for file uploads to AWS S3 and memory storage
import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from './s3Client.js';

// Multer S3 storage (for POST)
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME, 
    key: function (req, file, cb) {
      cb(null, `posters/${Date.now()}-${file.originalname}`); // file path in S3
    }
  })
});

// Multer memory storage (for PUT)
export const uploadMemory = multer({ storage: multer.memoryStorage() });