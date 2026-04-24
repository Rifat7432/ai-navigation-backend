import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { VenueZoneController } from './venueZone.controller';
import { VenueZoneValidation } from './venueZone.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  validateRequest(VenueZoneValidation.createVenueZoneZodSchema),
  VenueZoneController.createVenueZone
);

router.get('/', VenueZoneController.getAllVenueZones);

router.get('/:id', VenueZoneController.getVenueZoneById);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(VenueZoneValidation.updateVenueZoneZodSchema),
  VenueZoneController.updateVenueZone
);

router.delete('/:id', auth(USER_ROLES.ADMIN), VenueZoneController.deleteVenueZone);

export const VenueZoneRouter = router;
