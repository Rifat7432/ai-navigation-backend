import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VenueZoneService } from './venueZone.service';

const createVenueZone = catchAsync(async (req, res) => {
  const result = await VenueZoneService.createVenueZoneToDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Venue Zone created successfully',
    data: result,
  });
});

const getAllVenueZones = catchAsync(async (req, res) => {
  const result = await VenueZoneService.getAllVenueZonesFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Venue Zones retrieved successfully',
    data: result,
  });
});

const getVenueZoneById = catchAsync(async (req, res) => {
  const result = await VenueZoneService.getVenueZoneByIdFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Venue Zone retrieved successfully',
    data: result,
  });
});

const updateVenueZone = catchAsync(async (req, res) => {
  const result = await VenueZoneService.updateVenueZoneInDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Venue Zone updated successfully',
    data: result,
  });
});

const deleteVenueZone = catchAsync(async (req, res) => {
  const result = await VenueZoneService.deleteVenueZoneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Venue Zone deleted successfully',
    data: result,
  });
});

export const VenueZoneController = {
  createVenueZone,
  getAllVenueZones,
  getVenueZoneById,
  updateVenueZone,
  deleteVenueZone,
};
