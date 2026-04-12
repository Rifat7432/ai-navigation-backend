import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { MediaAssetController } from './mediaAsset.controller';
import { MediaAssetValidation } from './mediaAsset.validation';

const router = express.Router();

// Routes
router
     .route('/')
     .post(auth(USER_ROLES.USER), validateRequest(MediaAssetValidation.createMediaAssetZodSchema), MediaAssetController.createMediaAsset)
     .get(auth(USER_ROLES.USER), MediaAssetController.getMediaAssets);

router
     .route('/:id')
     .get(auth(USER_ROLES.USER), MediaAssetController.getMediaAsset)
     .patch(auth(USER_ROLES.USER), validateRequest(MediaAssetValidation.updateMediaAssetZodSchema), MediaAssetController.updateMediaAsset)
     .delete(auth(USER_ROLES.USER), MediaAssetController.deleteMediaAsset);

export const MediaAssetRoutes = router;