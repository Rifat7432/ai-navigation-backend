import { model, Schema } from 'mongoose';
import { IWalletTransaction, WalletTransactionModel } from './walletTransaction.interface';

// 11. WALLET TRANSACTION
//     Logs every credit / debit on a user's wallet.
const walletTransactionSchema = new Schema<IWalletTransaction, WalletTransactionModel>(
     {
          user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          type: {
               type: String,
               enum: ['credit', 'debit', 'withdrawal'],
               required: true,
          },
          amount: { type: Number, required: true }, // USD
          balanceAfter: { type: Number, required: true }, // wallet balance after this tx

          reason: {
               type: String,
               enum: ['venue_contribution_reward', 'withdrawal', 'bonus', 'refund'],
               required: true,
          },

          // Reference to what triggered this transaction
          contributionId: { type: Schema.Types.ObjectId, ref: 'VenueContribution', default: null },

          note: { type: String, default: null },
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: true },
);

walletTransactionSchema.index({ user: 1, createdAt: -1 });

walletTransactionSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
walletTransactionSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
walletTransactionSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const WalletTransaction = model<IWalletTransaction, WalletTransactionModel>('WalletTransaction', walletTransactionSchema);