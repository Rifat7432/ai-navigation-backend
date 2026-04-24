import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { ISearchHistory } from './searchHistory.interface';
import { SearchHistory } from './searchHistory.model';

const createSearchHistoryInDB = async (payload: Partial<ISearchHistory>) => {
  const result = await SearchHistory.create(payload);
  return result;
};

const getSearchHistoryFromDB = async (userId: string) => {
  const result = await SearchHistory.find({ user: userId }).sort({ searchedAt: -1 });
  return result;
};

const deleteSearchHistoryFromDB = async (id: string, userId: string) => {
  const result = await SearchHistory.findOneAndUpdate({ _id: id, user: userId }, { isDeleted: true }, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Search history not found');
  }
  return result;
};

export const SearchHistoryService = {
  createSearchHistoryInDB,
  getSearchHistoryFromDB,
  deleteSearchHistoryFromDB,
};
