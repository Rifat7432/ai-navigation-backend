import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IChatSession } from './chat.interface';
import { ChatSession } from './chat.model';

const createChatSessionInDB = async (payload: Partial<IChatSession>) => {
  const result = await ChatSession.create(payload);
  return result;
};

const getAllChatSessionsFromDB = async (userId: string) => {
  const result = await ChatSession.find({ user: userId }).sort({ updatedAt: -1 });
  return result;
};

const getChatSessionByIdFromDB = async (id: string, userId: string) => {
  const result = await ChatSession.findOne({ _id: id, user: userId });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Chat session not found');
  }
  return result;
};

const addMessageToSessionInDB = async (id: string, userId: string, message: any) => {
  const result = await ChatSession.findOneAndUpdate(
    { _id: id, user: userId },
    { $push: { messages: message } },
    { new: true }
  );
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Chat session not found');
  }
  return result;
};

const deleteChatSessionFromDB = async (id: string, userId: string) => {
  const result = await ChatSession.findOneAndUpdate(
    { _id: id, user: userId },
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Chat session not found');
  }
  return result;
};

export const ChatService = {
  createChatSessionInDB,
  getAllChatSessionsFromDB,
  getChatSessionByIdFromDB,
  addMessageToSessionInDB,
  deleteChatSessionFromDB,
};
