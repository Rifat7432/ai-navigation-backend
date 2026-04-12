import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { VenueZoneController } from './venueZone.controller';
import { VenueZoneValidation } from './venueZone.validation';

const router = express.Router();

// Routes
router
     .route('/')
     .post(auth(USER_ROLES.ADMIN), validateRequest(VenueZoneValidation.createVenueZoneZodSchema), VenueZoneController.createVenueZone)
     .get(VenueZoneController.getVenueZones);

router
     .route('/:id')
     .get(VenueZoneController.getVenueZone)
     .patch(auth(USER_ROLES.ADMIN), validateRequest(VenueZoneValidation.updateVenueZoneZodSchema), VenueZoneController.updateVenueZone)
     .delete(auth(USER_ROLES.ADMIN), VenueZoneController.deleteVenueZone);

export const VenueZoneRoutes = router;