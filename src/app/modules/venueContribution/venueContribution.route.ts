import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { VenueContributionController } from './venueContribution.controller';
import { VenueContributionValidation } from './venueContribution.validation';

const router = express.Router();

// Routes
router
     .route('/')
     .post(auth(USER_ROLES.USER), validateRequest(VenueContributionValidation.createVenueContributionZodSchema), VenueContributionController.createVenueContribution)
     .get(auth(USER_ROLES.USER), VenueContributionController.getVenueContributions);

router
     .route('/:id')
     .get(auth(USER_ROLES.USER), VenueContributionController.getVenueContribution)
     .patch(auth(USER_ROLES.ADMIN), validateRequest(VenueContributionValidation.updateVenueContributionZodSchema), VenueContributionController.updateVenueContribution)
     .delete(auth(USER_ROLES.ADMIN), VenueContributionController.deleteVenueContribution);

export const VenueContributionRoutes = router;