import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { VisualLandmarkController } from './visualLandmark.controller';
import { VisualLandmarkValidation } from './visualLandmark.validation';

const router = express.Router();

// Routes
router
     .route('/')
     .post(auth(USER_ROLES.ADMIN), validateRequest(VisualLandmarkValidation.createVisualLandmarkZodSchema), VisualLandmarkController.createVisualLandmark)
     .get(VisualLandmarkController.getVisualLandmarks);

router
     .route('/:id')
     .get(VisualLandmarkController.getVisualLandmark)
     .patch(auth(USER_ROLES.ADMIN), validateRequest(VisualLandmarkValidation.updateVisualLandmarkZodSchema), VisualLandmarkController.updateVisualLandmark)
     .delete(auth(USER_ROLES.ADMIN), VisualLandmarkController.deleteVisualLandmark);

export const VisualLandmarkRoutes = router;