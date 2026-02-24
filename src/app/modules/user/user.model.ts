import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { USER_ROLES } from '../../../enums/user';
import AppError from '../../../errors/AppError';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
     {
          email: {
               type: String,
               unique: true,
               lowercase: true,
          },
          phoneNumber: {
               type: String,
               default: '',
               index: true,
          },
          fullName: { type: String },
          firstName: { type: String },
          lastName: { type: String },
          image: { type: String },
          role: {
               type: String,
               enum: Object.values(USER_ROLES) as string[],
               default: USER_ROLES.USER,
          },
          password: {
               type: String,
               required: false,
               select: false,
               minlength: 8,
          },
          verified: {
               type: Boolean,
               default: false,
          },
          status: {
               type: String,
               default: 'active',
          },
          region: {
               type: String,
               default: '',
          },
          location: {
               type: String,
               default: '',
          },
          authProvider: {
               type: String,
               default: 'local',
          },
          socialId: {
               type: String,
               default: '', // Stores either Apple or Google ID
          },
          isResetPassword: {
               type: Boolean,
               default: false,
          },
          oneTimeCode: {
               type: Number,
               default: null,
          },
          OTPExpireAt: {
               type: Date,
               default: null,
          },
          isDeleted: {
               type: Boolean,
               default: false,
          },
     },
     { timestamps: true },
);

// Exist User Check
userSchema.statics.isExistUserById = async (id: string) => {
     return await User.findById(id);
};

// db.users.updateOne({email:"tihow91361@linxues.com"},{email:"rakibhassan305@gmail.com"})

userSchema.statics.isExistUserByEmail = async (email: string) => {
     return await User.findOne({ email });
};
userSchema.statics.isExistUserByPhone = async (phoneNumber: string) => {
     return await User.findOne({ phoneNumber });
};
// Password Matching
userSchema.statics.isMatchPassword = async (password: string, hashPassword: string): Promise<boolean> => {
     return await bcrypt.compare(password, hashPassword);
};

// Pre-Save Hook for Hashing Password & Checking Email Uniqueness
userSchema.pre('save', async function (this: any, next: any) {
     /* ================= EMAIL UNIQUENESS ================= */

     if (this.isModified && this.isModified('email')) {
          const isExist = await User.findOne({ email: this.get('email') });
          if (isExist && String(isExist._id) !== String(this._id)) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Email already exists!');
          }
     }

     /* ================= PASSWORD HASHING ================= */

     if (this.isModified && this.isModified('password') && this.password) {
          this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
     }

     /* ================= FULL NAME AUTO BUILD ================= */
     if ((this.isModified && this.isModified('firstName')) || this.isModified('lastName')) {
          const firstName = this.firstName?.trim() || '';
          const lastName = this.lastName?.trim() || '';

          this.fullName = [firstName, lastName].filter(Boolean).join(' ');
     }

     next();
});

// Query Middleware
userSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

userSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

userSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});
export const User = model<IUser, UserModel>('User', userSchema);
