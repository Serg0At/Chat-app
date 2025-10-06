import express from 'express';

import AuthController from '../controllers/auth.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/verify/start', AuthController.verifyTelegram)

// router.post('/login', AuthController.login);
// router.post('/logout', AuthController.logout);

// router.put('/update-profile', AuthMiddleware.protectRoute, AuthController.updateProfile);

router.get("/check", AuthMiddleware.protectRoute, (req, res) => res.status(200).json(req.user));

export default router;