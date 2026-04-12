import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { NavigationSessionService } from './navigationSession.service';

const createNavigationSession = catchAsync(async (req, res) => {
     const navigationSessionData = req.body;
     const result = await NavigationSessionService.createNavigationSessionToDB(navigationSessionData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Navigation session created successfully',
          data: result,
     });
});

const getNavigationSessions = catchAsync(async (req, res) => {
     const result = await NavigationSessionService.getNavigationSessionsFromDB(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Navigation sessions retrieved successfully',
          data: result,
     });
});

const getNavigationSession = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await NavigationSessionService.getNavigationSessionByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Navigation session retrieved successfully',
          data: result,
     });
});

const updateNavigationSession = catchAsync(async (req, res) => {
     const { id } = req.params;
     const navigationSessionData = req.body;
     const result = await NavigationSessionService.updateNavigationSessionInDB(id, navigationSessionData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Navigation session updated successfully',
          data: result,
     });
});

const deleteNavigationSession = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await NavigationSessionService.deleteNavigationSessionFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Navigation session deleted successfully',
          data: result,
     });
});

export const NavigationSessionController = {
     createNavigationSession,
     getNavigationSessions,
     getNavigationSession,
     updateNavigationSession,
     deleteNavigationSession,
};