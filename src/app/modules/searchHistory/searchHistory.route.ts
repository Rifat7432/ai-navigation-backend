import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { SearchHistoryController } from './searchHistory.controller';
import { SearchHistoryValidation } from './searchHistory.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  validateRequest(SearchHistoryValidation.createSearchHistoryZodSchema),
  SearchHistoryController.createSearchHistory
);

router.get('/', auth(USER_ROLES.USER), SearchHistoryController.getSearchHistory);

router.delete('/:id', auth(USER_ROLES.USER), SearchHistoryController.deleteSearchHistory);

export const SearchHistoryRouter = router;
