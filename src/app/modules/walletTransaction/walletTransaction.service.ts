import { StatusCodes } from 'http-status-codes';
import { IWalletTransaction } from './walletTransaction.interface';
import { WalletTransaction } from './walletTransaction.model';
import AppError from '../../../errors/AppError';

// create wallet transaction
const createWalletTransactionToDB = async (payload: IWalletTransaction): Promise<IWalletTransaction> => {
     const walletTransaction = await WalletTransaction.create(payload);
     if (!walletTransaction) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create wallet transaction');
     }
     return walletTransaction;
};

// get all wallet transactions
const getWalletTransactionsFromDB = async (query: any): Promise<IWalletTransaction[]> => {
     const walletTransactions = await WalletTransaction.find(query).populate('user contributionId');
     return walletTransactions;
};

// get single wallet transaction
const getWalletTransactionByIdFromDB = async (id: string): Promise<IWalletTransaction | null> => {
     const walletTransaction = await WalletTransaction.findById(id).populate('user contributionId');
     return walletTransaction;
};

// update wallet transaction
const updateWalletTransactionInDB = async (id: string, payload: Partial<IWalletTransaction>): Promise<IWalletTransaction | null> => {
     const walletTransaction = await WalletTransaction.findByIdAndUpdate(id, payload, { new: true });
     return walletTransaction;
};

// delete wallet transaction (soft delete)
const deleteWalletTransactionFromDB = async (id: string): Promise<IWalletTransaction | null> => {
     const walletTransaction = await WalletTransaction.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     return walletTransaction;
};

export const WalletTransactionService = {
     createWalletTransactionToDB,
     getWalletTransactionsFromDB,
     getWalletTransactionByIdFromDB,
     updateWalletTransactionInDB,
     deleteWalletTransactionFromDB,
};