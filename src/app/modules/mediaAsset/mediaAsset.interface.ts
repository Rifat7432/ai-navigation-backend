import { Model, Types } from 'mongoose';

export type IMediaAsset = {
     user: Types.ObjectId | string;
     mediaType: 'image' | 'video' | 'audio';
     purpose:
          | 'grounding_photo'
          | 'recheck_photo'
          | 'destination_photo'
          | 'venue_contribution'
          | 'voice_command'
          | 'chat_attachment';
     url: string;
     mimeType?: string;
     sizeBytes?: number;
     durationSec?: number;
     thumbnail?: string;
     aiAnalysis?: {
          detectedVenueType?: string;
          detectedZone?: string;
          detectedLandmarks?: {
               landmarkId: Types.ObjectId | string;
               name: string;
               confidence: number;
               boundingBox: {
                    x: number;
                    y: number;
                    width: number;
                    height: number;
               };
          }[];
          detectedText?: string;
          detectedLocation?: string;
          overallConfidence?: number;
          tags?: string[];
          analysedAt?: Date;
     };
     linkedVenue?: Types.ObjectId | string;
     isDeleted?: boolean;
};

export type MediaAssetModel = Model<IMediaAsset>;