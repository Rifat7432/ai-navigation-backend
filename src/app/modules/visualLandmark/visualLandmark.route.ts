import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { VisualLandmarkController } from './visualLandmark.controller';
import { VisualLandmarkValidation } from './visualLandmark.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  validateRequest(VisualLandmarkValidation.createVisualLandmarkZodSchema),
  VisualLandmarkController.createVisualLandmark
);

router.get('/', VisualLandmarkController.getAllVisualLandmarks);

router.get('/:id', VisualLandmarkController.getVisualLandmarkById);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(VisualLandmarkValidation.updateVisualLandmarkZodSchema),
  VisualLandmarkController.updateVisualLandmark
);

router.delete('/:id', auth(USER_ROLES.ADMIN), VisualLandmarkController.deleteVisualLandmark);

export const VisualLandmarkRouter = router;
