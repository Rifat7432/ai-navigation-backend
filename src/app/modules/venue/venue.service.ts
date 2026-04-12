import { StatusCodes } from 'http-status-codes';
import { IVenue } from './venue.interface';
import { Venue } from './venue.model';
import AppError from '../../../errors/AppError';

// create venue
const createVenueToDB = async (payload: IVenue): Promise<IVenue> => {
     const venue = await Venue.create(payload);
     if (!venue) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create venue');
     }
     return venue;
};

// get all venues
const getVenuesFromDB = async (query: any): Promise<IVenue[]> => {
     const venues = await Venue.find(query);
     return venues;
};

// get single venue
const getVenueByIdFromDB = async (id: string): Promise<IVenue | null> => {
     const venue = await Venue.findById(id);
     return venue;
};

// update venue
const updateVenueInDB = async (id: string, payload: Partial<IVenue>): Promise<IVenue | null> => {
     const venue = await Venue.findByIdAndUpdate(id, payload, { new: true });
     return venue;
};

// delete venue (soft delete)
const deleteVenueFromDB = async (id: string): Promise<IVenue | null> => {
     const venue = await Venue.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     return venue;
};

export const VenueService = {
     createVenueToDB,
     getVenuesFromDB,
     getVenueByIdFromDB,
     updateVenueInDB,
     deleteVenueFromDB,
};