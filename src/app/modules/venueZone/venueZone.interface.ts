import { Model } from 'mongoose';
import { Types } from 'mongoose';

export type IVenueZone = {
     venue: Types.ObjectId;
     name: string;
     floor?: number;
     zoneType?: 'store' | 'food_court' | 'restroom' | 'entrance' | 'exit' | 'corridor' | 'elevator' | 'escalator' | 'parking' | 'information' | 'other';
     description?: string;
     isDeleted?: boolean;
};

export type VenueZoneModel = Model<IVenueZone>;