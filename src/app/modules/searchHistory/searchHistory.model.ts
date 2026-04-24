import { Schema, model } from 'mongoose';

const searchHistorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', default: null },
    query: { type: String, default: null },
    resolvedAddress: { type: String, default: null },
    location: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
    inputType: {
      type: String,
      enum: ['text', 'voice', 'photo'],
      default: 'text',
    },
    searchedAt: { type: Date, default: Date.now, index: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: false }
);

searchHistorySchema.index({ user: 1, searchedAt: -1 });

searchHistorySchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const SearchHistory = model('SearchHistory', searchHistorySchema);
