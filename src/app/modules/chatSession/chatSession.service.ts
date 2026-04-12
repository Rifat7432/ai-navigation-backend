import { StatusCodes } from 'http-status-codes';
import { IChatSession } from './chatSession.interface';
import { ChatSession } from './chatSession.model';
import AppError from '../../../errors/AppError';

// create chat session
const createChatSessionToDB = async (payload: IChatSession): Promise<IChatSession> => {
     const chatSession = await ChatSession.create(payload);
     if (!chatSession) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create chat session');
     }
     return chatSession;
};

// get all chat sessions
const getChatSessionsFromDB = async (query: any): Promise<IChatSession[]> => {
     const chatSessions = await ChatSession.find(query).populate('user venue resolvedDestination resolvedVenueZone');
     return chatSessions;
};

// get single chat session
const getChatSessionByIdFromDB = async (id: string): Promise<IChatSession | null> => {
     const chatSession = await ChatSession.findById(id).populate('user venue resolvedDestination resolvedVenueZone');
     return chatSession;
};

// update chat session
const updateChatSessionInDB = async (id: string, payload: Partial<IChatSession>): Promise<IChatSession | null> => {
     const chatSession = await ChatSession.findByIdAndUpdate(id, payload, { new: true });
     return chatSession;
};

// delete chat session (soft delete)
const deleteChatSessionFromDB = async (id: string): Promise<IChatSession | null> => {
     const chatSession = await ChatSession.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     return chatSession;
};

export const ChatSessionService = {
     createChatSessionToDB,
     getChatSessionsFromDB,
     getChatSessionByIdFromDB,
     updateChatSessionInDB,
     deleteChatSessionFromDB,
};