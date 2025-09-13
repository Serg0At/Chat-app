import express from 'express';
import MessageController from '../controllers/message.controller.js';

const router = express.Router();

router.post('/send', MessageController.sendMessage)

export default router;