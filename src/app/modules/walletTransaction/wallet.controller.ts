import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WalletService } from './wallet.service';


const createTransaction = catchAsync(async (req, res) => {
  const result = await WalletService.createTransactionInDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Transaction created successfully',
    data: result,
  });
});

const getMyTransactions = catchAsync(async (req, res) => {
  const result = await WalletService.getMyTransactionsFromDB(req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Transactions retrieved successfully',
    data: result,
  });
});

const getTransactionById = catchAsync(async (req, res) => {
  const result = await WalletService.getTransactionByIdFromDB(req.params.id, req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Transaction retrieved successfully',
    data: result,
  });
});

export const WalletController = {
  createTransaction,
  getMyTransactions,
  getTransactionById,
};
