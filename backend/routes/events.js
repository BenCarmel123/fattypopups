import express from 'express';
import { uploadMemory } from '../config/index.js';
import { isAuthorized } from '../config/middleware/isAuthorized.js';
import * as eventController from '../controllers/eventController.js';

const eventRouter = express.Router();

eventRouter.get('/', eventController.getEvents);
eventRouter.get('/drafts', isAuthorized, eventController.getDraftEvents);
eventRouter.post('/', isAuthorized, uploadMemory.single('poster'), eventController.createEvent);
eventRouter.put('/:id', isAuthorized, uploadMemory.single('poster'), eventController.updateEvent);
eventRouter.delete('/', isAuthorized, eventController.deleteEventsByTitles);

export default eventRouter;
