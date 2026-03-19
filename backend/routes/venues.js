import express from 'express';
import * as venueController from '../controllers/venueController.js';

const venueRouter = express.Router();

venueRouter.get('/', venueController.getVenues);

export default venueRouter;