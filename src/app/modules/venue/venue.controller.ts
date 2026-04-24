import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VenueService } from './venue.service';

const createVenue = catchAsync(async (req, res) => {
  const result = await VenueService.createVenueToDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Venue created successfully',
    data: result,
  });
});

const getAllVenues = catchAsync(async (req, res) => {
  const { lat, lng, maxDistance } = req.query;
  let result;
  if (lat && lng) {
    result = await VenueService.getNearbyVenuesFromDB(Number(lat), Number(lng), Number(maxDistance) || 5000);
  } else {
    result = await VenueService.getAllVenuesFromDB();
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Venues retrieved successfully',
    data: result,
  });
});

const getVenueById = catchAsync(async (req, res) => {
  const result = await VenueService.getVenueByIdFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Venue retrieved successfully',
    data: result,
  });
});

const updateVenue = catchAsync(async (req, res) => {
  const result = await VenueService.updateVenueInDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Venue updated successfully',
    data: result,
  });
});

const deleteVenue = catchAsync(async (req, res) => {
  const result = await VenueService.deleteVenueFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Venue deleted successfully',
    data: result,
  });
});

export const VenueController = {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
};
