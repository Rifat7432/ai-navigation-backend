import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VenueService } from './venue.service';

const createVenue = catchAsync(async (req, res) => {
     const venueData = req.body;
     const result = await VenueService.createVenueToDB(venueData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Venue created successfully',
          data: result,
     });
});

const getVenues = catchAsync(async (req, res) => {
     const result = await VenueService.getVenuesFromDB(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venues retrieved successfully',
          data: result,
     });
});

const getVenue = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await VenueService.getVenueByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venue retrieved successfully',
          data: result,
     });
});

const updateVenue = catchAsync(async (req, res) => {
     const { id } = req.params;
     const venueData = req.body;
     const result = await VenueService.updateVenueInDB(id, venueData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venue updated successfully',
          data: result,
     });
});

const deleteVenue = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await VenueService.deleteVenueFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venue deleted successfully',
          data: result,
     });
});

export const VenueController = {
     createVenue,
     getVenues,
     getVenue,
     updateVenue,
     deleteVenue,
};