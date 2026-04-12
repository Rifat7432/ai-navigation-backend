import { Model } from 'mongoose';
import { Types } from 'mongoose';

export type IChatMessage = {
     role: 'user' | 'assistant';
     text?: string;
     attachments?: {
          assetId: Types.ObjectId;
          mediaType: 'image' | 'video' | 'audio';
          url: string;
          purpose: string;
     }[];
     actionCard?: {
          cardType?: 'start_navigation' | 'directions' | 'location_info' | 'product_location' | 'recheck_request' | null;
          locationId?: Types.ObjectId;
          venueZoneId?: Types.ObjectId;
          address?: string;
          label?: string;
          ctaLabel?: string;
     };
     navigationInstruction?: {
          instructionText?: string;
          landmarkRef?: Types.ObjectId;
          maneuver?: 'straight' | 'left' | 'right' | 'u_turn' | 'arrive' | null;
          isCorrection?: boolean;
     };
     voiceTranscript?: string;
     createdAt?: Date;
};

export type IChatSession = {
     user: Types.ObjectId;
     venue?: Types.ObjectId;
     title?: string;
     messages: IChatMessage[];
     resolvedDestination?: Types.ObjectId;
     resolvedVenueZone?: Types.ObjectId;
     status?: 'active' | 'closed';
     isDeleted?: boolean;
};

export type ChatSessionModel = Model<IChatSession>;