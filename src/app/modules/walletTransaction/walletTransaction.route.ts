import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { WalletTransactionController } from './walletTransaction.controller';
import { WalletTransactionValidation } from './walletTransaction.validation';

const router = express.Router();

// Routes
router
     .route('/')
     .post(auth(USER_ROLES.ADMIN), validateRequest(WalletTransactionValidation.createWalletTransactionZodSchema), WalletTransactionController.createWalletTransaction)
     .get(auth(USER_ROLES.USER), WalletTransactionController.getWalletTransactions);

router
     .route('/:id')
     .get(auth(USER_ROLES.USER), WalletTransactionController.getWalletTransaction)
     .patch(auth(USER_ROLES.ADMIN), validateRequest(WalletTransactionValidation.updateWalletTransactionZodSchema), WalletTransactionController.updateWalletTransaction)
     .delete(auth(USER_ROLES.ADMIN), WalletTransactionController.deleteWalletTransaction);

export const WalletTransactionRoutes = router;