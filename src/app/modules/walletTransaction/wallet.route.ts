import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { WalletController } from './wallet.controller';
import { WalletValidation } from './wallet.validation';


const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  validateRequest(WalletValidation.createTransactionZodSchema),
  WalletController.createTransaction
);

router.get('/', auth(USER_ROLES.USER), WalletController.getMyTransactions);

router.get('/:id', auth(USER_ROLES.USER), WalletController.getTransactionById);

export const WalletRouter = router;
