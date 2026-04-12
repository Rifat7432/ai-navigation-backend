import { StatusCodes } from 'http-status-codes';
import { IVisualLandmark } from './visualLandmark.interface';
import { VisualLandmark } from './visualLandmark.model';
import AppError from '../../../errors/AppError';

// create visual landmark
const createVisualLandmarkToDB = async (payload: IVisualLandmark): Promise<IVisualLandmark> => {
     const visualLandmark = await VisualLandmark.create(payload);
     if (!visualLandmark) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create visual landmark');
     }
     return visualLandmark;
};

// get all visual landmarks
const getVisualLandmarksFromDB = async (query: any): Promise<IVisualLandmark[]> => {
     const visualLandmarks = await VisualLandmark.find(query).populate('venue zone');
     return visualLandmarks;
};

// get single visual landmark
const getVisualLandmarkByIdFromDB = async (id: string): Promise<IVisualLandmark | null> => {
     const visualLandmark = await VisualLandmark.findById(id).populate('venue zone');
     return visualLandmark;
};

// update visual landmark
const updateVisualLandmarkInDB = async (id: string, payload: Partial<IVisualLandmark>): Promise<IVisualLandmark | null> => {
     const visualLandmark = await VisualLandmark.findByIdAndUpdate(id, payload, { new: true });
     return visualLandmark;
};

// delete visual landmark (soft delete)
const deleteVisualLandmarkFromDB = async (id: string): Promise<IVisualLandmark | null> => {
     const visualLandmark = await VisualLandmark.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     return visualLandmark;
};

export const VisualLandmarkService = {
     createVisualLandmarkToDB,
     getVisualLandmarksFromDB,
     getVisualLandmarkByIdFromDB,
     updateVisualLandmarkInDB,
     deleteVisualLandmarkFromDB,
};