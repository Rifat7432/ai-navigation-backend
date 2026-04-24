import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ContributionService } from './contribution.service';

const createContribution = catchAsync(async (req, res) => {
  const result = await ContributionService.createContributionInDB({
    contributor: req.user?.id,
    ...req.body,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Contribution submitted successfully',
    data: result,
  });
});

const getAllContributions = catchAsync(async (req, res) => {
  const result = await ContributionService.getAllContributionsFromDB(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Contributions retrieved successfully',
    data: result,
  });
});

const getContributionById = catchAsync(async (req, res) => {
  const result = await ContributionService.getContributionByIdFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Contribution retrieved successfully',
    data: result,
  });
});

const reviewContribution = catchAsync(async (req, res) => {
  const result = await ContributionService.reviewContributionInDB(req.params.id, req.user?.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Contribution reviewed successfully',
    data: result,
  });
});

export const ContributionController = {
  createContribution,
  getAllContributions,
  getContributionById,
  reviewContribution,
};
