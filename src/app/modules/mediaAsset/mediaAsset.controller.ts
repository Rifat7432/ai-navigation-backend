import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MediaAssetService } from './mediaAsset.service';

const createMediaAsset = catchAsync(async (req, res) => {
     const mediaAssetData = req.body;
     const result = await MediaAssetService.createMediaAssetToDB(mediaAssetData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Media asset created successfully',
          data: result,
     });
});

const getMediaAssets = catchAsync(async (req, res) => {
     const result = await MediaAssetService.getMediaAssetsFromDB(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Media assets retrieved successfully',
          data: result,
     });
});

const getMediaAsset = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await MediaAssetService.getMediaAssetByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Media asset retrieved successfully',
          data: result,
     });
});

const updateMediaAsset = catchAsync(async (req, res) => {
     const { id } = req.params;
     const mediaAssetData = req.body;
     const result = await MediaAssetService.updateMediaAssetInDB(id, mediaAssetData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Media asset updated successfully',
          data: result,
     });
});

const deleteMediaAsset = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await MediaAssetService.deleteMediaAssetFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Media asset deleted successfully',
          data: result,
     });
});

export const MediaAssetController = {
     createMediaAsset,
     getMediaAssets,
     getMediaAsset,
     updateMediaAsset,
     deleteMediaAsset,
};