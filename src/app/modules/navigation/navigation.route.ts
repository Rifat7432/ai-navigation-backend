import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import { NavigationController } from './navigation.controller';

const router = express.Router();

router.post('/start', auth(USER_ROLES.USER), NavigationController.startNavigation);
router.post('/grounding', auth(USER_ROLES.USER), NavigationController.processGrounding);
router.post('/instruction/:sessionId', auth(USER_ROLES.USER), NavigationController.getNextInstruction);
router.post('/verify-inbound', auth(USER_ROLES.USER), NavigationController.verifyInboundLocation);
router.patch('/ai-conversation/:sessionId', auth(USER_ROLES.USER), NavigationController.updateAiConversation);

export const NavigationRouter = router;
