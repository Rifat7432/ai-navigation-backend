import { Model } from 'mongoose';
import { Types } from 'mongoose';

export type IVenueContribution = {
     contributor: Types.ObjectId;
     venue?: Types.ObjectId;
     zone?: Types.ObjectId;
     mediaAssets: Types.ObjectId[];
     description?: string;
     suggestedVenueDetails?: {
          name?: string;
          venueType?: string;
          address?: string;
          city?: string;
          country?: string;
     };
     status?: 'pending' | 'under_review' | 'approved' | 'rejected';
     reviewedBy?: Types.ObjectId;
     reviewNote?: string;
     reviewedAt?: Date;
     rewardAmount?: number;
     rewardPaid?: boolean;
     rewardPaidAt?: Date;
     isDeleted?: boolean;
};

export type VenueContributionModel = Model<IVenueContribution>;