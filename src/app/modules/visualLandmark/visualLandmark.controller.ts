import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VisualLandmarkService } from './visualLandmark.service';

const createVisualLandmark = catchAsync(async (req, res) => {
     const visualLandmarkData = req.body;
     const result = await VisualLandmarkService.createVisualLandmarkToDB(visualLandmarkData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Visual landmark created successfully',
          data: result,
     });
});

const getVisualLandmarks = catchAsync(async (req, res) => {
     const result = await VisualLandmarkService.getVisualLandmarksFromDB(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Visual landmarks retrieved successfully',
          data: result,
     });
});

const getVisualLandmark = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await VisualLandmarkService.getVisualLandmarkByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Visual landmark retrieved successfully',
          data: result,
     });
});

const updateVisualLandmark = catchAsync(async (req, res) => {
     const { id } = req.params;
     const visualLandmarkData = req.body;
     const result = await VisualLandmarkService.updateVisualLandmarkInDB(id, visualLandmarkData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Visual landmark updated successfully',
          data: result,
     });
});

const deleteVisualLandmark = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await VisualLandmarkService.deleteVisualLandmarkFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Visual landmark deleted successfully',
          data: result,
     });
});

export const VisualLandmarkController = {
     createVisualLandmark,
     getVisualLandmarks,
     getVisualLandmark,
     updateVisualLandmark,
     deleteVisualLandmark,
};