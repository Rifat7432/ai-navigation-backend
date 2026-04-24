import { Schema, model } from 'mongoose';

const subscriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    revenueCatId: { type: String, required: true },
    plan: { type: String, enum: ['free', 'premium', 'pro'], default: 'free' },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

subscriptionSchema.pre('find', function (this: any, next: (err?: any) => void) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const Subscription = model('Subscription', subscriptionSchema);
