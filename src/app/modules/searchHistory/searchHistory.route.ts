import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { SearchHistoryController } from './searchHistory.controller';
import { SearchHistoryValidation } from './searchHistory.validation';

const router = express.Router();

// Routes
router
     .route('/')
     .post(auth(USER_ROLES.USER), validateRequest(SearchHistoryValidation.createSearchHistoryZodSchema), SearchHistoryController.createSearchHistory)
     .get(auth(USER_ROLES.USER), SearchHistoryController.getSearchHistories);

router
     .route('/:id')
     .get(auth(USER_ROLES.USER), SearchHistoryController.getSearchHistory)
     .patch(auth(USER_ROLES.USER), validateRequest(SearchHistoryValidation.updateSearchHistoryZodSchema), SearchHistoryController.updateSearchHistory)
     .delete(auth(USER_ROLES.USER), SearchHistoryController.deleteSearchHistory);

export const SearchHistoryRoutes = router;