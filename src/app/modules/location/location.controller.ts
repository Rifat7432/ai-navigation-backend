import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { LocationService } from './location.service';

const createLocation = catchAsync(async (req, res) => {
  const result = await LocationService.createLocationInDB({
    user: req.user?.id,
    ...req.body,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Location created successfully',
    data: result,
  });
});

const getAllLocations = catchAsync(async (req, res) => {
  const result = await LocationService.getAllLocationsFromDB(req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Locations retrieved successfully',
    data: result,
  });
});

const getLocationById = catchAsync(async (req, res) => {
  const result = await LocationService.getLocationByIdFromDB(req.params.id, req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Location retrieved successfully',
    data: result,
  });
});

const updateLocation = catchAsync(async (req, res) => {
  const result = await LocationService.updateLocationInDB(req.params.id, req.user?.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Location updated successfully',
    data: result,
  });
});

const deleteLocation = catchAsync(async (req, res) => {
  const result = await LocationService.deleteLocationFromDB(req.params.id, req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Location deleted successfully',
    data: result,
  });
});

export const LocationController = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
};
