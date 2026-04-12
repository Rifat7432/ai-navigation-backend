import { model, Schema } from 'mongoose';
import { IVenueContribution, VenueContributionModel } from './venueContribution.interface';

// 10. VENUE CONTRIBUTION
//     Users upload photos/videos of unmapped venues to earn money.
//     Each approved contribution credits the user's wallet.
const venueContributionSchema = new Schema<IVenueContribution, VenueContributionModel>(
     {
          contributor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null }, // null = new venue suggestion
          zone: { type: Schema.Types.ObjectId, ref: 'VenueZone', default: null },

          // What they submitted
          mediaAssets: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset', required: true }],
          description: { type: String, default: null }, // optional note from contributor

          // New venue details (if venue doesn't exist yet)
          suggestedVenueDetails: {
               name: { type: String, default: null },
               venueType: { type: String, default: null },
               address: { type: String, default: null },
               city: { type: String, default: null },
               country: { type: String, default: null },
          },

          // Review workflow
          status: {
               type: String,
               enum: ['pending', 'under_review', 'approved', 'rejected'],
               default: 'pending',
          },
          reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // MAIZ admin
          reviewNote: { type: String, default: null },
          reviewedAt: { type: Date, default: null },

          // Reward
          rewardAmount: { type: Number, default: 0 }, // USD credited on approval
          rewardPaid: { type: Boolean, default: false },
          rewardPaidAt: { type: Date, default: null },

          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

venueContributionSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
venueContributionSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
venueContributionSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const VenueContribution = model<IVenueContribution, VenueContributionModel>('VenueContribution', venueContributionSchema);