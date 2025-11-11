import express from 'express';

import MessageController from '../controllers/message.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();

router.use(arcjetProtection, AuthMiddleware.protectRoute);

router.get('/contacts', MessageController.getAllContacts)
router.get('/chats', MessageController.getChatPartners)
router.get('/:id', MessageController.getMessagesByUserId)

router.post('/send/:id', MessageController.sendMessage)

export default router;