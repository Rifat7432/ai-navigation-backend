import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { ChatSessionController } from './chatSession.controller';
import { ChatSessionValidation } from './chatSession.validation';

const router = express.Router();

// Routes
router
     .route('/')
     .post(auth(USER_ROLES.USER), validateRequest(ChatSessionValidation.createChatSessionZodSchema), ChatSessionController.createChatSession)
     .get(auth(USER_ROLES.USER), ChatSessionController.getChatSessions);

router
     .route('/:id')
     .get(auth(USER_ROLES.USER), ChatSessionController.getChatSession)
     .patch(auth(USER_ROLES.USER), validateRequest(ChatSessionValidation.updateChatSessionZodSchema), ChatSessionController.updateChatSession)
     .delete(auth(USER_ROLES.USER), ChatSessionController.deleteChatSession);

export const ChatSessionRoutes = router;