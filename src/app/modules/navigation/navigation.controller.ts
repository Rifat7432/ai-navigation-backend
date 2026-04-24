import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { NavigationService } from './navigation.service';


const startNavigation = catchAsync(async (req, res) => {
  const result = await NavigationService.startNavigation(req.user?.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Navigation started',
    data: result,
  });
});

const processGrounding = catchAsync(async (req, res) => {
  const result = await NavigationService.processGrounding(req.user?.id, req.body.mediaAssetId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Grounding processed',
    data: result,
  });
});

const getNextInstruction = catchAsync(async (req, res) => {
  const result = await NavigationService.getNextInstruction(req.params.sessionId, req.body.message);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Instruction retrieved',
    data: result,
  });
});

const updateAiConversation = catchAsync(async (req, res) => {
  const result = await NavigationService.updateAiConversation(req.params.sessionId, req.body.message);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'AI conversation updated',
    data: result,
  });
});

const verifyInboundLocation = catchAsync(async (req, res) => {
  const { sessionId, mediaAssetId } = req.body;
  const result = await NavigationService.verifyInboundLocation(sessionId, mediaAssetId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Inbound location verified',
    data: result,
  });
});

export const NavigationController = {
  startNavigation,
  processGrounding,
  getNextInstruction,
  updateAiConversation,
  verifyInboundLocation,
};
