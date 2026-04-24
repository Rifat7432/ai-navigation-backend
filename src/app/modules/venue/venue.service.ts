import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IVenue } from './venue.interface';
import { Venue } from './venue.model';

const createVenueToDB = async (payload: IVenue) => {
  const result = await Venue.create(payload);
  return result;
};

const getAllVenuesFromDB = async () => {
  const result = await Venue.find();
  return result;
};

const getNearbyVenuesFromDB = async (lat: number, lng: number, maxDistance: number = 5000) => {
  const result = await Venue.find({
    gpsCoordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: maxDistance,
      },
    },
  });
  return result;
};

const getVenueByIdFromDB = async (id: string) => {
  const result = await Venue.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Venue not found');
  }
  return result;
};

const updateVenueInDB = async (id: string, payload: Partial<IVenue>) => {
  const result = await Venue.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Venue not found');
  }
  return result;
};

const deleteVenueFromDB = async (id: string) => {
  const result = await Venue.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Venue not found');
  }
  return result;
};

export const VenueService = {
  createVenueToDB,
  getAllVenuesFromDB,
  getNearbyVenuesFromDB,
  getVenueByIdFromDB,
  updateVenueInDB,
  deleteVenueFromDB,
};
