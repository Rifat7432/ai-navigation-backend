import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChatService } from './chat.service';
import { AIService } from '../ai/ai.service';

const createChatSession = catchAsync(async (req, res) => {
  const result = await ChatService.createChatSessionInDB({
    user: req.user?.id,
    ...req.body,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chat session created successfully',
    data: result,
  });
});

const getAllChatSessions = catchAsync(async (req, res) => {
  const result = await ChatService.getAllChatSessionsFromDB(req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chat sessions retrieved successfully',
    data: result,
  });
});

const getChatSessionById = catchAsync(async (req, res) => {
  const result = await ChatService.getChatSessionByIdFromDB(req.params.id, req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chat session retrieved successfully',
    data: result,
  });
});

const sendMessage = catchAsync(async (req, res) => {
  const { message: userMessage } = req.body;
  
  // 1. Get current session
  const session = await ChatService.getChatSessionByIdFromDB(req.params.id, req.user?.id);
  
  // 2. Add user message
  const userMsg = {
    role: 'user',
    message: userMessage,
    createdAt: new Date(),
  };
  await ChatService.addMessageToSessionInDB(req.params.id, req.user?.id, userMsg);
  
  // 3. Generate AI response
  const aiResponse = await AIService.generateChatResponse(session.messages, userMessage, req.user?.id);
  
  // 4. Add AI message
  const aiMsg = {
    role: 'assistant',
    message: aiResponse,
    createdAt: new Date(),
  };
  const result = await ChatService.addMessageToSessionInDB(req.params.id, req.user?.id, aiMsg);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Message sent and response generated',
    data: result,
  });
});

const deleteChatSession = catchAsync(async (req, res) => {
  const result = await ChatService.deleteChatSessionFromDB(req.params.id, req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chat session deleted successfully',
    data: result,
  });
});

export const ChatController = {
  createChatSession,
  getAllChatSessions,
  getChatSessionById,
  sendMessage,
  deleteChatSession,
};
