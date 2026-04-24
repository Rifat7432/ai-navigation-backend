import { Schema, model } from 'mongoose';

const walletTransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['credit', 'debit', 'withdrawal'],
      required: true,
    },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reason: {
      type: String,
      enum: ['venue_contribution_reward', 'withdrawal', 'bonus', 'refund'],
      required: true,
    },
    contributionId: { type: Schema.Types.ObjectId, ref: 'VenueContribution', default: null },
    note: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

walletTransactionSchema.index({ user: 1, createdAt: -1 });

walletTransactionSchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const WalletTransaction = model('WalletTransaction', walletTransactionSchema);
