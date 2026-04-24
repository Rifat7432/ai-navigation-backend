import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { ChatController } from './chat.controller';
import { ChatValidation } from './chat.validation';


const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  validateRequest(ChatValidation.createChatSessionZodSchema),
  ChatController.createChatSession
);

router.get('/', auth(USER_ROLES.USER), ChatController.getAllChatSessions);

router.get('/:id', auth(USER_ROLES.USER), ChatController.getChatSessionById);

router.post(
  '/:id/messages',
  auth(USER_ROLES.USER),
  validateRequest(ChatValidation.sendMessageZodSchema),
  ChatController.sendMessage
);

router.delete('/:id', auth(USER_ROLES.USER), ChatController.deleteChatSession);

export const ChatRouter = router;
