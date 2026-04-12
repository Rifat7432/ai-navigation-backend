import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VenueZoneService } from './venueZone.service';

const createVenueZone = catchAsync(async (req, res) => {
     const venueZoneData = req.body;
     const result = await VenueZoneService.createVenueZoneToDB(venueZoneData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Venue zone created successfully',
          data: result,
     });
});

const getVenueZones = catchAsync(async (req, res) => {
     const result = await VenueZoneService.getVenueZonesFromDB(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venue zones retrieved successfully',
          data: result,
     });
});

const getVenueZone = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await VenueZoneService.getVenueZoneByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venue zone retrieved successfully',
          data: result,
     });
});

const updateVenueZone = catchAsync(async (req, res) => {
     const { id } = req.params;
     const venueZoneData = req.body;
     const result = await VenueZoneService.updateVenueZoneInDB(id, venueZoneData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venue zone updated successfully',
          data: result,
     });
});

const deleteVenueZone = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await VenueZoneService.deleteVenueZoneFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venue zone deleted successfully',
          data: result,
     });
});

export const VenueZoneController = {
     createVenueZone,
     getVenueZones,
     getVenueZone,
     updateVenueZone,
     deleteVenueZone,
};