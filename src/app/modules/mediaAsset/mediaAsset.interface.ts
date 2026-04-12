import { Model } from 'mongoose';
import { Types } from 'mongoose';

export type IMediaAsset = {
     user: Types.ObjectId;
     mediaType: 'image' | 'video' | 'audio';
     purpose: 'grounding_photo' | 'recheck_photo' | 'destination_photo' | 'venue_contribution' | 'voice_command' | 'chat_attachment';
     url: string;
     mimeType?: string;
     sizeBytes?: number;
     durationSec?: number;
     thumbnail?: string;
     aiAnalysis?: {
          detectedVenueType?: string;
          detectedZone?: string;
          detectedLandmarks?: {
               landmarkId: Types.ObjectId;
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
     linkedVenue?: Types.ObjectId;
     isDeleted?: boolean;
};

export type MediaAssetModel = Model<IMediaAsset>;