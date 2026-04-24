import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IVisualLandmark } from './visualLandmark.interface';
import { VisualLandmark } from './visualLandmark.model';

const createVisualLandmarkToDB = async (payload: IVisualLandmark) => {
  const result = await VisualLandmark.create(payload);
  return result;
};

const getAllVisualLandmarksFromDB = async () => {
  const result = await VisualLandmark.find().populate('venue').populate('zone');
  return result;
};

const getVisualLandmarkByIdFromDB = async (id: string) => {
  const result = await VisualLandmark.findById(id).populate('venue').populate('zone');
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Visual Landmark not found');
  }
  return result;
};

const updateVisualLandmarkInDB = async (id: string, payload: Partial<IVisualLandmark>) => {
  const result = await VisualLandmark.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Visual Landmark not found');
  }
  return result;
};

const deleteVisualLandmarkFromDB = async (id: string) => {
  const result = await VisualLandmark.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Visual Landmark not found');
  }
  return result;
};

export const VisualLandmarkService = {
  createVisualLandmarkToDB,
  getAllVisualLandmarksFromDB,
  getVisualLandmarkByIdFromDB,
  updateVisualLandmarkInDB,
  deleteVisualLandmarkFromDB,
};
