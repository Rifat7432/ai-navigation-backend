import { Model } from 'mongoose';
import { Types } from 'mongoose';

export type ILocation = {
     user: Types.ObjectId;
     venue?: Types.ObjectId;
     zone?: Types.ObjectId;
     label?: string;
     address?: string;
     locationType?: 'indoor' | 'outdoor';
     floor?: number;
     gpsCoordinates: {
          type: 'Point';
          coordinates: [number, number];
     };
     indoorPosition?: {
          x?: number;
          y?: number;
     };
     isFavorite?: boolean;
     visitedAt?: Date;
     isDeleted?: boolean;
};

export type LocationModel = Model<ILocation>;