import { Model } from 'mongoose';
import { Types } from 'mongoose';

export type ISearchHistory = {
     user: Types.ObjectId;
     venue?: Types.ObjectId;
     query?: string;
     resolvedAddress?: string;
     location?: Types.ObjectId;
     inputType?: 'text' | 'voice' | 'photo';
     searchedAt?: Date;
     isDeleted?: boolean;
};

export type SearchHistoryModel = Model<ISearchHistory>;