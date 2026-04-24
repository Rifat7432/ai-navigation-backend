import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VisualLandmarkService } from './visualLandmark.service';

const createVisualLandmark = catchAsync(async (req, res) => {
  const result = await VisualLandmarkService.createVisualLandmarkToDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Visual Landmark created successfully',
    data: result,
  });
});

const getAllVisualLandmarks = catchAsync(async (req, res) => {
  const result = await VisualLandmarkService.getAllVisualLandmarksFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Visual Landmarks retrieved successfully',
    data: result,
  });
});

const getVisualLandmarkById = catchAsync(async (req, res) => {
  const result = await VisualLandmarkService.getVisualLandmarkByIdFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Visual Landmark retrieved successfully',
    data: result,
  });
});

const updateVisualLandmark = catchAsync(async (req, res) => {
  const result = await VisualLandmarkService.updateVisualLandmarkInDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Visual Landmark updated successfully',
    data: result,
  });
});

const deleteVisualLandmark = catchAsync(async (req, res) => {
  const result = await VisualLandmarkService.deleteVisualLandmarkFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Visual Landmark deleted successfully',
    data: result,
  });
});

export const VisualLandmarkController = {
  createVisualLandmark,
  getAllVisualLandmarks,
  getVisualLandmarkById,
  updateVisualLandmark,
  deleteVisualLandmark,
};
