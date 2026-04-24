import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IVenueZone } from './venueZone.interface';
import { VenueZone } from './venueZone.model';

const createVenueZoneToDB = async (payload: IVenueZone) => {
  const result = await VenueZone.create(payload);
  return result;
};

const getAllVenueZonesFromDB = async () => {
  const result = await VenueZone.find().populate('venue');
  return result;
};

const getVenueZoneByIdFromDB = async (id: string) => {
  const result = await VenueZone.findById(id).populate('venue');
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Venue Zone not found');
  }
  return result;
};

const updateVenueZoneInDB = async (id: string, payload: Partial<IVenueZone>) => {
  const result = await VenueZone.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Venue Zone not found');
  }
  return result;
};

const deleteVenueZoneFromDB = async (id: string) => {
  const result = await VenueZone.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Venue Zone not found');
  }
  return result;
};

export const VenueZoneService = {
  createVenueZoneToDB,
  getAllVenueZonesFromDB,
  getVenueZoneByIdFromDB,
  updateVenueZoneInDB,
  deleteVenueZoneFromDB,
};
