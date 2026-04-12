import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WalletTransactionService } from './walletTransaction.service';

const createWalletTransaction = catchAsync(async (req, res) => {
     const walletTransactionData = req.body;
     const result = await WalletTransactionService.createWalletTransactionToDB(walletTransactionData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Wallet transaction created successfully',
          data: result,
     });
});

const getWalletTransactions = catchAsync(async (req, res) => {
     const result = await WalletTransactionService.getWalletTransactionsFromDB(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Wallet transactions retrieved successfully',
          data: result,
     });
});

const getWalletTransaction = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await WalletTransactionService.getWalletTransactionByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Wallet transaction retrieved successfully',
          data: result,
     });
});

const updateWalletTransaction = catchAsync(async (req, res) => {
     const { id } = req.params;
     const walletTransactionData = req.body;
     const result = await WalletTransactionService.updateWalletTransactionInDB(id, walletTransactionData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Wallet transaction updated successfully',
          data: result,
     });
});

const deleteWalletTransaction = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await WalletTransactionService.deleteWalletTransactionFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Wallet transaction deleted successfully',
          data: result,
     });
});

export const WalletTransactionController = {
     createWalletTransaction,
     getWalletTransactions,
     getWalletTransaction,
     updateWalletTransaction,
     deleteWalletTransaction,
};