import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import { upload } from '../../middleware/fileUploadHandler';
import validateRequest from '../../middleware/validateRequest';
import catchAsync from '../../../shared/catchAsync';
import { MediaAssetController } from './mediaAsset.controller';
import { MediaAssetValidation } from './mediaAsset.validation';

const router = express.Router();

router.post(
  '/upload',
  auth(USER_ROLES.USER),
  upload.single('file'),
  validateRequest(MediaAssetValidation.createMediaAssetZodSchema),
  MediaAssetController.uploadMediaAsset,
);

export const MediaAssetRoutes = router;
