import { StatusCodes } from 'http-status-codes';
import { ILocation } from './location.interface';
import { Location } from './location.model';
import AppError from '../../../errors/AppError';

// create location
const createLocationToDB = async (payload: ILocation): Promise<ILocation> => {
     const location = await Location.create(payload);
     if (!location) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create location');
     }
     return location;
};

// get all locations
const getLocationsFromDB = async (query: any): Promise<ILocation[]> => {
     const locations = await Location.find(query).populate('user venue zone');
     return locations;
};

// get single location
const getLocationByIdFromDB = async (id: string): Promise<ILocation | null> => {
     const location = await Location.findById(id).populate('user venue zone');
     return location;
};

// update location
const updateLocationInDB = async (id: string, payload: Partial<ILocation>): Promise<ILocation | null> => {
     const location = await Location.findByIdAndUpdate(id, payload, { new: true });
     return location;
};

// delete location (soft delete)
const deleteLocationFromDB = async (id: string): Promise<ILocation | null> => {
     const location = await Location.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     return location;
};

export const LocationService = {
     createLocationToDB,
     getLocationsFromDB,
     getLocationByIdFromDB,
     updateLocationInDB,
     deleteLocationFromDB,
};