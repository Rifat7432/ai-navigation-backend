import { Model } from 'mongoose';
import { Types } from 'mongoose';

export type IVisualLandmark = {
     venue: Types.ObjectId;
     zone?: Types.ObjectId;
     floor?: number;
     name: string;
     landmarkType?: 'store_sign' | 'aisle_sign' | 'pillar' | 'entrance_gate' | 'escalator' | 'elevator' | 'restroom_sign' | 'information_desk' | 'other';
     referenceImages?: string[];
     visualDescriptor?: string;
     relativePosition?: {
          x?: number;
          y?: number;
     };
     isActive?: boolean;
     isDeleted?: boolean;
};

export type VisualLandmarkModel = Model<IVisualLandmark>;