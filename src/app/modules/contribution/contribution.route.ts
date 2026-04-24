import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { ContributionController } from './contribution.controller';
import { ContributionValidation } from './contribution.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  validateRequest(ContributionValidation.createContributionZodSchema),
  ContributionController.createContribution
);

router.get('/', auth(USER_ROLES.ADMIN), ContributionController.getAllContributions);

router.get('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.USER), ContributionController.getContributionById);

router.patch(
  '/:id/review',
  auth(USER_ROLES.ADMIN),
  validateRequest(ContributionValidation.reviewContributionZodSchema),
  ContributionController.reviewContribution
);

export const ContributionRouter = router;
