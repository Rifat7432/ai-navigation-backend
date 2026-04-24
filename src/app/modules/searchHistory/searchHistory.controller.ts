import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SearchHistoryService } from './searchHistory.service';

const createSearchHistory = catchAsync(async (req, res) => {
  const result = await SearchHistoryService.createSearchHistoryInDB({
    user: req.user?.id,
    ...req.body,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Search history created successfully',
    data: result,
  });
});

const getSearchHistory = catchAsync(async (req, res) => {
  const result = await SearchHistoryService.getSearchHistoryFromDB(req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Search history retrieved successfully',
    data: result,
  });
});

const deleteSearchHistory = catchAsync(async (req, res) => {
  const result = await SearchHistoryService.deleteSearchHistoryFromDB(req.params.id, req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Search history deleted successfully',
    data: result,
  });
});

export const SearchHistoryController = {
  createSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
};
