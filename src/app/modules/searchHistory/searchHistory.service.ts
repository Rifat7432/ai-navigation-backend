import { StatusCodes } from 'http-status-codes';
import { ISearchHistory } from './searchHistory.interface';
import { SearchHistory } from './searchHistory.model';
import AppError from '../../../errors/AppError';

// create search history
const createSearchHistoryToDB = async (payload: ISearchHistory): Promise<ISearchHistory> => {
     const searchHistory = await SearchHistory.create(payload);
     if (!searchHistory) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create search history');
     }
     return searchHistory;
};

// get all search histories
const getSearchHistoriesFromDB = async (query: any): Promise<ISearchHistory[]> => {
     const searchHistories = await SearchHistory.find(query).populate('user venue location');
     return searchHistories;
};

// get single search history
const getSearchHistoryByIdFromDB = async (id: string): Promise<ISearchHistory | null> => {
     const searchHistory = await SearchHistory.findById(id).populate('user venue location');
     return searchHistory;
};

// update search history
const updateSearchHistoryInDB = async (id: string, payload: Partial<ISearchHistory>): Promise<ISearchHistory | null> => {
     const searchHistory = await SearchHistory.findByIdAndUpdate(id, payload, { new: true });
     return searchHistory;
};

// delete search history (soft delete)
const deleteSearchHistoryFromDB = async (id: string): Promise<ISearchHistory | null> => {
     const searchHistory = await SearchHistory.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     return searchHistory;
};

export const SearchHistoryService = {
     createSearchHistoryToDB,
     getSearchHistoriesFromDB,
     getSearchHistoryByIdFromDB,
     updateSearchHistoryInDB,
     deleteSearchHistoryFromDB,
};