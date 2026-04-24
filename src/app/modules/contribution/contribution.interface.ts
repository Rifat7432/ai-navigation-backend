import { Types } from 'mongoose';

export type IVenueContribution = {
  contributor: Types.ObjectId;
  venue?: Types.ObjectId | null;
  zone?: Types.ObjectId | null;
  mediaAssets: Types.ObjectId[];
  description?: string | null;
  suggestedVenueDetails?: {
    name?: string | null;
    venueType?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
  };
  status?: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewedBy?: Types.ObjectId | null;
  reviewNote?: string | null;
  reviewedAt?: Date | null;
  rewardAmount?: number;
  rewardPaid?: boolean;
  rewardPaidAt?: Date | null;
  isNewPlace?: boolean;
  aiKnowledgeCheck?: {
    hasAiKnowledge?: boolean | null;
    aiAnalysisSummary?: string | null;
  };
  isDeleted?: boolean;
};
