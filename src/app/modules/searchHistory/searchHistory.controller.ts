import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SearchHistoryService } from './searchHistory.service';

const createSearchHistory = catchAsync(async (req, res) => {
     const searchHistoryData = req.body;
     const result = await SearchHistoryService.createSearchHistoryToDB(searchHistoryData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Search history created successfully',
          data: result,
     });
});

const getSearchHistories = catchAsync(async (req, res) => {
     const result = await SearchHistoryService.getSearchHistoriesFromDB(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Search histories retrieved successfully',
          data: result,
     });
});

const getSearchHistory = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await SearchHistoryService.getSearchHistoryByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Search history retrieved successfully',
          data: result,
     });
});

const updateSearchHistory = catchAsync(async (req, res) => {
     const { id } = req.params;
     const searchHistoryData = req.body;
     const result = await SearchHistoryService.updateSearchHistoryInDB(id, searchHistoryData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Search history updated successfully',
          data: result,
     });
});

const deleteSearchHistory = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await SearchHistoryService.deleteSearchHistoryFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Search history deleted successfully',
          data: result,
     });
});

export const SearchHistoryController = {
     createSearchHistory,
     getSearchHistories,
     getSearchHistory,
     updateSearchHistory,
     deleteSearchHistory,
};