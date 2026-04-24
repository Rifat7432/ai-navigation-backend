import { Schema, model } from 'mongoose';

const venueContributionSchema = new Schema(
  {
    contributor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },
    zone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },
    mediaAssets: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset', required: true }],
    description: { type: String, default: null },
    suggestedVenueDetails: {
      name: { type: String, default: null },
      venueType: { type: String, default: null },
      address: { type: String, default: null },
      city: { type: String, default: null },
      country: { type: String, default: null },
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    reviewNote: { type: String, default: null },
    reviewedAt: { type: Date, default: null },
    rewardAmount: { type: Number, default: 0 },
    rewardPaid: { type: Boolean, default: false },
    rewardPaidAt: { type: Date, default: null },
    isNewPlace: { type: Boolean, default: false },
    aiKnowledgeCheck: {
      hasAiKnowledge: { type: Boolean, default: null },
      aiAnalysisSummary: { type: String, default: null },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

venueContributionSchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const VenueContribution = model('VenueContribution', venueContributionSchema);
