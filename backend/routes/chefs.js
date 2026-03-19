import express from 'express';
import * as chefController from '../controllers/chefController.js';

const chefRouter = express.Router();

chefRouter.get('/', chefController.getChefs);

export default chefRouter;