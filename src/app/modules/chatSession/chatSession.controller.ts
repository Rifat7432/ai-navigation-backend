import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChatSessionService } from './chatSession.service';

const createChatSession = catchAsync(async (req, res) => {
     const chatSessionData = req.body;
     const result = await ChatSessionService.createChatSessionToDB(chatSessionData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Chat session created successfully',
          data: result,
     });
});

const getChatSessions = catchAsync(async (req, res) => {
     const result = await ChatSessionService.getChatSessionsFromDB(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Chat sessions retrieved successfully',
          data: result,
     });
});

const getChatSession = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await ChatSessionService.getChatSessionByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Chat session retrieved successfully',
          data: result,
     });
});

const updateChatSession = catchAsync(async (req, res) => {
     const { id } = req.params;
     const chatSessionData = req.body;
     const result = await ChatSessionService.updateChatSessionInDB(id, chatSessionData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Chat session updated successfully',
          data: result,
     });
});

const deleteChatSession = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await ChatSessionService.deleteChatSessionFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Chat session deleted successfully',
          data: result,
     });
});

export const ChatSessionController = {
     createChatSession,
     getChatSessions,
     getChatSession,
     updateChatSession,
     deleteChatSession,
};