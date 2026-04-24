import { Types } from 'mongoose';

export type ILocation = {
  user: Types.ObjectId;
  venue?: Types.ObjectId | null;
  zone?: Types.ObjectId | null;
  label?: string;
  address?: string;
  locationType?: 'indoor' | 'outdoor';
  floor?: number | null;
  gpsCoordinates?: {
    type: 'Point';
    coordinates: [number, number];
  };
  indoorPosition?: {
    x: number | null;
    y: number | null;
  };
  isFavorite?: boolean;
  visitedAt?: Date;
  isDeleted?: boolean;
};
