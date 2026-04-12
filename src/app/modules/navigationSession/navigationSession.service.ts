import { StatusCodes } from 'http-status-codes';
import { INavigationSession } from './navigationSession.interface';
import { NavigationSession } from './navigationSession.model';
import AppError from '../../../errors/AppError';

// create navigation session
const createNavigationSessionToDB = async (payload: INavigationSession): Promise<INavigationSession> => {
     const navigationSession = await NavigationSession.create(payload);
     if (!navigationSession) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create navigation session');
     }
     return navigationSession;
};

// get all navigation sessions
const getNavigationSessionsFromDB = async (query: any): Promise<INavigationSession[]> => {
     const navigationSessions = await NavigationSession.find(query).populate('user venue chatSession mediaAssets origin destination');
     return navigationSessions;
};

// get single navigation session
const getNavigationSessionByIdFromDB = async (id: string): Promise<INavigationSession | null> => {
     const navigationSession = await NavigationSession.findById(id).populate('user venue chatSession mediaAssets origin destination');
     return navigationSession;
};

// update navigation session
const updateNavigationSessionInDB = async (id: string, payload: Partial<INavigationSession>): Promise<INavigationSession | null> => {
     const navigationSession = await NavigationSession.findByIdAndUpdate(id, payload, { new: true });
     return navigationSession;
};

// delete navigation session (soft delete)
const deleteNavigationSessionFromDB = async (id: string): Promise<INavigationSession | null> => {
     const navigationSession = await NavigationSession.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     return navigationSession;
};

export const NavigationSessionService = {
     createNavigationSessionToDB,
     getNavigationSessionsFromDB,
     getNavigationSessionByIdFromDB,
     updateNavigationSessionInDB,
     deleteNavigationSessionFromDB,
};