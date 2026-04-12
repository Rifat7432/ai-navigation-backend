import { Model } from 'mongoose';
import { Types } from 'mongoose';

export type IWalletTransaction = {
     user: Types.ObjectId;
     type: 'credit' | 'debit' | 'withdrawal';
     amount: number;
     balanceAfter: number;
     reason: 'venue_contribution_reward' | 'withdrawal' | 'bonus' | 'refund';
     contributionId?: Types.ObjectId;
     note?: string;
     isDeleted?: boolean;
};

export type WalletTransactionModel = Model<IWalletTransaction>;