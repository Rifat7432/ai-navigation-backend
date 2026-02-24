import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
export type IUser = {
     email: string;
     phoneNumber?: string;
     fullName?: string;
     firstName?: string;
     lastName?: string;
     image?: string;
     role?: string;
     password?: string;
     verified?: boolean;
     status?: string;
     region?: string;
     location?: string;
     authProvider?: 'google' | 'apple' | 'local';
     socialId?: string;
     isResetPassword?: boolean;
     oneTimeCode?: number | null;
     OTPExpireAt?: Date | null;
     isDeleted?: boolean;
};

export type UserModel = {
     isExistUserById(id: string): any;
     isExistUserByEmail(email: string): any;
     isExistUserByPhone(phoneNumber: string): any;
     isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
