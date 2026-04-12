import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { VenueController } from './venue.controller';
import { VenueValidation } from './venue.validation';

const router = express.Router();

// Routes
router
     .route('/')
     .post(auth(USER_ROLES.ADMIN), validateRequest(VenueValidation.createVenueZodSchema), VenueController.createVenue)
     .get(VenueController.getVenues);

router
     .route('/:id')
     .get(VenueController.getVenue)
     .patch(auth(USER_ROLES.ADMIN), validateRequest(VenueValidation.updateVenueZodSchema), VenueController.updateVenue)
     .delete(auth(USER_ROLES.ADMIN), VenueController.deleteVenue);

export const VenueRoutes = router;