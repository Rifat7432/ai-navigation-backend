import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { LocationController } from './location.controller';
import { LocationValidation } from './location.validation';

const router = express.Router();

// Routes
router
     .route('/')
     .post(auth(USER_ROLES.USER), validateRequest(LocationValidation.createLocationZodSchema), LocationController.createLocation)
     .get(auth(USER_ROLES.USER), LocationController.getLocations);

router
     .route('/:id')
     .get(auth(USER_ROLES.USER), LocationController.getLocation)
     .patch(auth(USER_ROLES.USER), validateRequest(LocationValidation.updateLocationZodSchema), LocationController.updateLocation)
     .delete(auth(USER_ROLES.USER), LocationController.deleteLocation);

export const LocationRoutes = router;