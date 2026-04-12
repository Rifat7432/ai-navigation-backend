import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { LocationService } from './location.service';

const createLocation = catchAsync(async (req, res) => {
     const locationData = req.body;
     const result = await LocationService.createLocationToDB(locationData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Location created successfully',
          data: result,
     });
});

const getLocations = catchAsync(async (req, res) => {
     const result = await LocationService.getLocationsFromDB(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Locations retrieved successfully',
          data: result,
     });
});

const getLocation = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await LocationService.getLocationByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Location retrieved successfully',
          data: result,
     });
});

const updateLocation = catchAsync(async (req, res) => {
     const { id } = req.params;
     const locationData = req.body;
     const result = await LocationService.updateLocationInDB(id, locationData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Location updated successfully',
          data: result,
     });
});

const deleteLocation = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await LocationService.deleteLocationFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Location deleted successfully',
          data: result,
     });
});

export const LocationController = {
     createLocation,
     getLocations,
     getLocation,
     updateLocation,
     deleteLocation,
};