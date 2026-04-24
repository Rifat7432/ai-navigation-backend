import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { LocationController } from './location.controller';
import { LocationValidation } from './location.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  validateRequest(LocationValidation.createLocationZodSchema),
  LocationController.createLocation
);

router.get('/', auth(USER_ROLES.USER), LocationController.getAllLocations);

router.get('/:id', auth(USER_ROLES.USER), LocationController.getLocationById);

router.patch(
  '/:id',
  auth(USER_ROLES.USER),
  validateRequest(LocationValidation.updateLocationZodSchema),
  LocationController.updateLocation
);

router.delete('/:id', auth(USER_ROLES.USER), LocationController.deleteLocation);

export const LocationRouter = router;
