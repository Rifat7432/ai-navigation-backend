import { StatusCodes } from 'http-status-codes';
import { IVenueZone } from './venueZone.interface';
import { VenueZone } from './venueZone.model';
import AppError from '../../../errors/AppError';

// create venue zone
const createVenueZoneToDB = async (payload: IVenueZone): Promise<IVenueZone> => {
     const venueZone = await VenueZone.create(payload);
     if (!venueZone) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create venue zone');
     }
     return venueZone;
};

// get all venue zones
const getVenueZonesFromDB = async (query: any): Promise<IVenueZone[]> => {
     const venueZones = await VenueZone.find(query).populate('venue');
     return venueZones;
};

// get single venue zone
const getVenueZoneByIdFromDB = async (id: string): Promise<IVenueZone | null> => {
     const venueZone = await VenueZone.findById(id).populate('venue');
     return venueZone;
};

// update venue zone
const updateVenueZoneInDB = async (id: string, payload: Partial<IVenueZone>): Promise<IVenueZone | null> => {
     const venueZone = await VenueZone.findByIdAndUpdate(id, payload, { new: true });
     return venueZone;
};

// delete venue zone (soft delete)
const deleteVenueZoneFromDB = async (id: string): Promise<IVenueZone | null> => {
     const venueZone = await VenueZone.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     return venueZone;
};

export const VenueZoneService = {
     createVenueZoneToDB,
     getVenueZonesFromDB,
     getVenueZoneByIdFromDB,
     updateVenueZoneInDB,
     deleteVenueZoneFromDB,
};