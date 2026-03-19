import express from 'express';
import * as authController from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get('/google', authController.redirectToGoogle);
authRouter.get('/google/callback', authController.handleGoogleCallback);
authRouter.get('/check', authController.checkAuth);

export default authRouter;