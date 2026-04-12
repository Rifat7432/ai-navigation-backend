import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VenueContributionService } from './venueContribution.service';

const createVenueContribution = catchAsync(async (req, res) => {
     const venueContributionData = req.body;
     const result = await VenueContributionService.createVenueContributionToDB(venueContributionData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Venue contribution created successfully',
          data: result,
     });
});

const getVenueContributions = catchAsync(async (req, res) => {
     const result = await VenueContributionService.getVenueContributionsFromDB(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venue contributions retrieved successfully',
          data: result,
     });
});

const getVenueContribution = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await VenueContributionService.getVenueContributionByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venue contribution retrieved successfully',
          data: result,
     });
});

const updateVenueContribution = catchAsync(async (req, res) => {
     const { id } = req.params;
     const venueContributionData = req.body;
     const result = await VenueContributionService.updateVenueContributionInDB(id, venueContributionData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venue contribution updated successfully',
          data: result,
     });
});

const deleteVenueContribution = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await VenueContributionService.deleteVenueContributionFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Venue contribution deleted successfully',
          data: result,
     });
});

export const VenueContributionController = {
     createVenueContribution,
     getVenueContributions,
     getVenueContribution,
     updateVenueContribution,
     deleteVenueContribution,
};