import { Types } from 'mongoose';

export type IVisualLandmark = {
  venue: Types.ObjectId;
  zone?: Types.ObjectId | null;
  floor?: number;
  name: string;
  landmarkType?: 'store_sign' | 'aisle_sign' | 'pillar' | 'entrance_gate' | 'escalator' | 'elevator' | 'restroom_sign' | 'information_desk' | 'other';
  referenceImages?: string[];
  visualDescriptor?: string | null;
  relativePosition?: {
    x: number | null;
    y: number | null;
  };
  isActive?: boolean;
  isDeleted?: boolean;
};
