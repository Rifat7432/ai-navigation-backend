import { Model } from 'mongoose';

export type IVenue = {
     name: string;
     venueType: 'mall' | 'airport' | 'supermarket' | 'hospital' | 'office' | 'university' | 'other';
     address?: string;
     city?: string;
     country?: string;
     gpsCoordinates: {
          type: 'Point';
          coordinates: [number, number]; // [lng, lat]
     };
     totalFloors?: number;
     mappingStatus?: 'unmapped' | 'partial' | 'complete';
     coverImage?: string;
     isVerified?: boolean;
     isDeleted?: boolean;
};

export type VenueModel = Model<IVenue>;