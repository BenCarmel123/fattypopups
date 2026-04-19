import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from '../clients/s3.js';

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: function (_req, file, cb) {
      cb(null, `posters/${Date.now()}-${file.originalname}`); 
    }
  })
});

export const uploadMemory = multer({ storage: multer.memoryStorage() });