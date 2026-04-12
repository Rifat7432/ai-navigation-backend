import { model, Schema } from 'mongoose';
import { ISearchHistory, SearchHistoryModel } from './searchHistory.interface';

// 9. SEARCH HISTORY
//    Powers History screen — Today / Last Week / Last Month
const searchHistorySchema = new Schema<ISearchHistory, SearchHistoryModel>(
     {
          user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
          venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },

          query: { type: String, default: null }, // raw voice / text query
          resolvedAddress: { type: String, default: null }, // "Tv gate, Mohakhali, Dhaka 1212"
          location: { type: Schema.Types.ObjectId, ref: 'Location', default: null },

          inputType: {
               type: String,
               enum: ['text', 'voice', 'photo'],
               default: 'text',
          },

          searchedAt: { type: Date, default: Date.now, index: true },
          isDeleted: { type: Boolean, default: false },
     },
     { timestamps: false },
);

// Compound index — fast Today / Last Week / Last Month queries
searchHistorySchema.index({ user: 1, searchedAt: -1 });

searchHistorySchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
searchHistorySchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});
searchHistorySchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const SearchHistory = model<ISearchHistory, SearchHistoryModel>('SearchHistory', searchHistorySchema);