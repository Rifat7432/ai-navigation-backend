import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IWalletTransaction } from './wallet.interface';
import { WalletTransaction } from './wallet.model';
import { User } from '../user/user.model';

const createTransactionInDB = async (payload: Partial<IWalletTransaction>) => {
  const user = await User.findById(payload.user);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // In a real app, you'd update the user's balance here too
  // For now, we just log the transaction
  const result = await WalletTransaction.create({
    ...payload,
    balanceAfter: 0, // Placeholder
  });
  return result;
};

const getMyTransactionsFromDB = async (userId: string) => {
  const result = await WalletTransaction.find({ user: userId }).sort({ createdAt: -1 });
  return result;
};

const getTransactionByIdFromDB = async (id: string, userId: string) => {
  const result = await WalletTransaction.findOne({ _id: id, user: userId });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Transaction not found');
  }
  return result;
};

export const WalletService = {
  createTransactionInDB,
  getMyTransactionsFromDB,
  getTransactionByIdFromDB,
};
