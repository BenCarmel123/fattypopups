import express from 'express';
import { uploadMemory } from '../config/middleware/multer.js';
import { isAuthorized } from '../config/middleware/isAuthorized.js';
import * as draftController from '../controllers/draftController.js';

const draftRouter = express.Router();

draftRouter.post('/draft', isAuthorized, uploadMemory.fields([{ name: 'poster' }, 
  { name: 'context_image' }]), draftController.createDraft);

export default draftRouter;