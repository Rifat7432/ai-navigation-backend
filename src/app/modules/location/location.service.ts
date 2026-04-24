import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { ILocation } from './location.interface';
import { Location } from './location.model';

const createLocationInDB = async (payload: Partial<ILocation>) => {
  const result = await Location.create(payload);
  return result;
};

const getAllLocationsFromDB = async (userId: string) => {
  const result = await Location.find({ user: userId }).populate('venue').populate('zone');
  return result;
};

const getLocationByIdFromDB = async (id: string, userId: string) => {
  const result = await Location.findOne({ _id: id, user: userId }).populate('venue').populate('zone');
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Location not found');
  }
  return result;
};

const updateLocationInDB = async (id: string, userId: string, payload: Partial<ILocation>) => {
  const result = await Location.findOneAndUpdate({ _id: id, user: userId }, payload, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Location not found');
  }
  return result;
};

const deleteLocationFromDB = async (id: string, userId: string) => {
  const result = await Location.findOneAndUpdate({ _id: id, user: userId }, { isDeleted: true }, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Location not found');
  }
  return result;
};

export const LocationService = {
  createLocationInDB,
  getAllLocationsFromDB,
  getLocationByIdFromDB,
  updateLocationInDB,
  deleteLocationFromDB,
};
