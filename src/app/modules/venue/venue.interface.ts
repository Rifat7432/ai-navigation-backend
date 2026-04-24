import { Types } from 'mongoose';

export type IVenue = {
  name: string;
  venueType: 'mall' | 'airport' | 'supermarket' | 'hospital' | 'office' | 'university' | 'other';
  address?: string;
  city?: string;
  country?: string;
  gpsCoordinates?: {
    type: 'Point';
    coordinates: [number, number];
  };
  totalFloors?: number;
  mappingStatus?: 'unmapped' | 'partial' | 'complete';
  coverImage?: string | null;
  isVerified?: boolean;
  isDeleted?: boolean;
};
