import { Types } from 'mongoose';

export type ISearchHistory = {
  user: Types.ObjectId;
  venue?: Types.ObjectId | null;
  query?: string | null;
  resolvedAddress?: string | null;
  location?: Types.ObjectId | null;
  inputType?: 'text' | 'voice' | 'photo';
  searchedAt?: Date;
  isDeleted?: boolean;
};
