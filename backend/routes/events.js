import express from 'express';
import { uploadMemory } from '../config/index.js';
import { isAuthorized } from '../config/middleware/isAuthorized.js';
import { isInternalService } from '../config/middleware/isInternalService.js';
import { eventsLimiter } from '../config/middleware/rateLimiter.js';
import * as eventController from '../controllers/eventController.js';

const eventRouter = express.Router();

eventRouter.get('/', eventsLimiter, eventController.getEvents);

eventRouter.get('/drafts', isAuthorized, eventController.getDraftEvents);

eventRouter.post('/', isAuthorized, uploadMemory.single('poster'), eventController.createEvent);

eventRouter.put('/:id', isAuthorized, uploadMemory.single('poster'), eventController.updateEvent);

eventRouter.delete('/cleanup-past', isInternalService, eventController.cleanupPastEvents);

eventRouter.delete('/:id', isAuthorized, eventController.deleteEventById);

export default eventRouter;
