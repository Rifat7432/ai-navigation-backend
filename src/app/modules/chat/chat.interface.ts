import { Types } from 'mongoose';

export type IChatMessage = {
  role: 'user' | 'assistant';
  text?: string | null;
  attachments?: {
    assetId: Types.ObjectId;
    mediaType: 'image' | 'video' | 'audio';
    url: string;
    purpose: string;
  }[];
  actionCard?: {
    cardType: 'start_navigation' | 'directions' | 'location_info' | 'product_location' | 'recheck_request' | null;
    locationId?: Types.ObjectId | null;
    venueZoneId?: Types.ObjectId | null;
    address?: string | null;
    label?: string | null;
    ctaLabel?: string | null;
  };
  navigationInstruction?: {
    instructionText?: string | null;
    landmarkRef?: Types.ObjectId | null;
    maneuver?: 'straight' | 'left' | 'right' | 'u_turn' | 'arrive' | null;
    isCorrection?: boolean;
  };
  voiceTranscript?: string | null;
  createdAt?: Date;
};

export type IChatSession = {
  user: Types.ObjectId;
  venue?: Types.ObjectId | null;
  title?: string;
  messages: IChatMessage[];
  resolvedDestination?: Types.ObjectId | null;
  resolvedVenueZone?: Types.ObjectId | null;
  status?: 'active' | 'closed';
  isDeleted?: boolean;
};
