import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { NavigationSessionController } from './navigationSession.controller';
import { NavigationSessionValidation } from './navigationSession.validation';

const router = express.Router();

// Routes
router
     .route('/')
     .post(auth(USER_ROLES.USER), validateRequest(NavigationSessionValidation.createNavigationSessionZodSchema), NavigationSessionController.createNavigationSession)
     .get(auth(USER_ROLES.USER), NavigationSessionController.getNavigationSessions);

router
     .route('/:id')
     .get(auth(USER_ROLES.USER), NavigationSessionController.getNavigationSession)
     .patch(auth(USER_ROLES.USER), validateRequest(NavigationSessionValidation.updateNavigationSessionZodSchema), NavigationSessionController.updateNavigationSession)
     .delete(auth(USER_ROLES.USER), NavigationSessionController.deleteNavigationSession);

export const NavigationSessionRoutes = router;