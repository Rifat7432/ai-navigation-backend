import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { VenueController } from './venue.controller';
import { VenueValidation } from './venue.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  validateRequest(VenueValidation.createVenueZodSchema),
  VenueController.createVenue
);

router.get('/', VenueController.getAllVenues);

router.get('/:id', VenueController.getVenueById);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(VenueValidation.updateVenueZodSchema),
  VenueController.updateVenue
);

router.delete('/:id', auth(USER_ROLES.ADMIN), VenueController.deleteVenue);

export const VenueRouter = router;
