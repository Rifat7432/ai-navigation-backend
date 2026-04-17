import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import { IUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../../errors/AppError';
import generateOTP from '../../../utils/generateOTP';
import config from '../../../config';
import { jwtHelper } from '../../../helpers/jwtHelper';
import mongoose from 'mongoose';

// create user
const createUserToDB = async (payload: Partial<IUser>) => {
     // Ensure email is present before creating user
     if (!payload.email) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Email is required');
     }

     // Check if user already exists
     const user = await User.findOne({ email: payload.email });
     if (user) {
          throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
     }

     // Development mode without transactions
     const createUser = await User.create(payload);

     if (!createUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
     }

     //send email
     const otp = generateOTP(4);
     const values = {
          name: createUser.email, // Use email as name since name field not in schema
          otp: otp,
          email: createUser.email!,
     };
     await User.findOneAndUpdate({ _id: createUser._id }, { $set: { oneTimeCode: otp, OTPExpireAt: new Date(Date.now() + 5 * 60000) } });

     const createAccountTemplate = emailTemplate.createAccount(values);
     await emailHelper.sendEmail(createAccountTemplate);

     return values;
};

const handleAppleAuthentication = async (payload: {
     email: string;
     appleId: string;
     fullName: {
          givenName: string;
          familyName: string;
     };
     deviceToken?: string;
}): Promise<any> => {
     const { email, appleId, fullName } = payload;
     // Check if the user already exists by Apple ID or email
     const existingUser = await User.findOne({ email }).select('+password');
     // If user doesn't exist, treat it as a sign-up
     if (!existingUser) {
          // Check if the user is signing up with Apple and email is not already in use
          const userExists = await User.isExistUserByEmail(email);
          if (userExists) {
               throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
          }
          // Create the new user
          const newUser = await User.create({
               email,
               socialId: appleId,
               lastName: fullName.familyName,
               firstName: fullName.givenName,
               authProvider: 'apple',
               password: appleId,
               role: USER_ROLES.USER, // Default role as User
          });
          if (!newUser) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
          }
          // if (payload.deviceToken) {
          //      const notificationSettings = await NotificationSettings.findOne({ userId: newUser._id });
          //      if (notificationSettings) {
          //           const deviceTokens = notificationSettings?.deviceTokenList || [];
          //           if (deviceTokens.includes(payload.deviceToken) === false) {
          //                deviceTokens.push(payload.deviceToken);
          //                notificationSettings.deviceTokenList = deviceTokens;
          //                await notificationSettings.save();
          //           }
          //      } else {
          //           await NotificationSettings.create({ userId: newUser._id, deviceTokens: [payload.deviceToken] });
          //      }
          // }
          // Send OTP for email verification
          const otp = generateOTP(4);
          const values = {
               name: newUser.fullName,
               otp,
               email: newUser.email,
          };
          await User.findOneAndUpdate({ _id: newUser._id }, { $set: { oneTimeCode: otp, OTPExpireAt: new Date(Date.now() + 5 * 60000) } });
          if (config.node_env === 'production') {
               const createAccountTemplate = emailTemplate.createAccount(values);
               await emailHelper.sendEmail(createAccountTemplate);
               // Save OTP for later verification

               return { message: 'Account created successfully, please verify via OTP' };
          }
          return { message: 'Account created successfully, please verify via OTP', values };
     }
     // If user exists, perform login
     if (existingUser) {
          // check verified and status
          if (!existingUser.verified) {
               //send mail
               const otp = generateOTP(4);
               const value = { otp, email: existingUser.email };
               const forgetPassword = emailTemplate.resetPassword(value);
               await emailHelper.sendEmail(forgetPassword);
               //save to DB
               await User.findOneAndUpdate({ email }, { $set: { oneTimeCode: otp, OTPExpireAt: new Date(Date.now() + 15 * 60000) } });

               throw new AppError(StatusCodes.CONFLICT, 'Please verify your account, then try to login again');
          }
          // check user status
          if (existingUser?.status === 'blocked') {
               throw new AppError(StatusCodes.BAD_REQUEST, 'You don’t have permission to access this content. It looks like your account has been blocked.');
          }
          const jwtData = { id: existingUser._id, role: existingUser.role, email: existingUser.email };
          // create token
          const accessToken = jwtHelper.createToken(jwtData, config.jwt.jwt_secret as Secret, config.jwt.jwt_expire_in as string);
          const refreshToken = jwtHelper.createToken(jwtData, config.jwt.jwt_refresh_secret as Secret, config.jwt.jwt_refresh_expire_in as string);
          await User.findByIdAndUpdate(existingUser._id, { $inc: { loginCount: 1 } }, { new: true });

          // Determine which video to show

          return { accessToken, refreshToken };
     }

     throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'An unknown error occurred');
};

const handleGoogleAuthentication = async (payload: { email: string; googleId: string; name: string; email_verified: boolean; picture?: string; deviceToken?: string }): Promise<any> => {
     const { email, googleId, email_verified, name } = payload;

     // Check if the user already exists by Google ID or email
     const existingUser = await User.findOne({ email }).select('+password');

     // If user doesn't exist, treat it as a sign-up
     if (!existingUser) {
          // Check if the user is signing up with Google and email is not already in use
          const userExists = await User.isExistUserByEmail(email);
          if (userExists) {
               throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
          }
          // Create the new user
          const newUser = await User.create({
               image: payload?.picture || '',
               email,
               socialId: googleId,
               verified: email_verified,
               name,
               password: googleId,
               authProvider: 'google',
               role: USER_ROLES.USER, // Default role as User
          });
          if (!newUser) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
          }
          // if (payload.deviceToken) {
          //      const notificationSettings = await NotificationSettings.findOne({ userId: newUser._id });
          //      if (notificationSettings) {
          //           const deviceTokens = notificationSettings?.deviceTokenList || [];
          //           if (deviceTokens.includes(payload.deviceToken) === false) {
          //                deviceTokens.push(payload.deviceToken);
          //                notificationSettings.deviceTokenList = deviceTokens;
          //                await notificationSettings.save();
          //           }
          //      } else {
          //           await NotificationSettings.create({ userId: newUser._id, deviceTokens: [payload.deviceToken] });
          //      }
          // }
          // Send OTP for email verification
          if (email_verified) {
               return { message: 'Account created and verified successfully' };
          }
          const otp = generateOTP(4);
          const values = {
               name: newUser.fullName,
               otp,
               email: newUser.email,
          };
          await User.findOneAndUpdate({ _id: newUser._id }, { $set: { oneTimeCode: otp, OTPExpireAt: new Date(Date.now() + 5 * 60000) } });
          if (config.node_env === 'production') {
               const createAccountTemplate = emailTemplate.createAccount(values);
               await emailHelper.sendEmail(createAccountTemplate);

               // Save OTP for later verification

               return { message: 'Account created successfully, please verify via OTP' };
          }
          return { message: 'Account created successfully, please verify via OTP', values };
     }
     // If user exists, perform login
     if (existingUser) {
          // check verified and status
          if (!existingUser.verified) {
               //send mail
               const otp = generateOTP(4);
               const value = { otp, email: existingUser.email };
               const forgetPassword = emailTemplate.resetPassword(value);
               await emailHelper.sendEmail(forgetPassword);

               //save to DB
               await User.findOneAndUpdate({ email }, { $set: { oneTimeCode: otp, OTPExpireAt: new Date(Date.now() + 15 * 60000) } });

               throw new AppError(StatusCodes.CONFLICT, 'Please verify your account, then try to login again');
          }

          // check user status
          if (existingUser?.status === 'blocked') {
               throw new AppError(StatusCodes.BAD_REQUEST, 'You don’t have permission to access this content. It looks like your account has been blocked.');
          }

          const jwtData = { id: existingUser._id, role: existingUser.role, email: existingUser.email };
          // create token
          const accessToken = jwtHelper.createToken(jwtData, config.jwt.jwt_secret as Secret, config.jwt.jwt_expire_in as string);
          const refreshToken = jwtHelper.createToken(jwtData, config.jwt.jwt_refresh_secret as Secret, config.jwt.jwt_refresh_expire_in as string);
          await User.findByIdAndUpdate(existingUser._id, { $inc: { loginCount: 1 } }, { new: true });

          // Determine which video to show

          return { accessToken, refreshToken };
     }

     throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'An unknown error occurred');
};

// get user profile
const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
     const { id } = user;
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser && isExistUser.isDeleted === true) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     return isExistUser;
};
const getUserFromDB = async (id: string): Promise<Partial<IUser>> => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser && isExistUser.isDeleted === true) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     return isExistUser;
};

// export const getUsersWithSubscriptionsFromDB = async (query: any): Promise<UserSubscriptionDTO[]> => {
//      const { searchTerm: search, status: filterStatus = 'all', page = 1, limit = 10 } = query;

//      const skip = (page - 1) * limit;

//      const searchFilter = search
//           ? {
//                  $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
//             }
//           : {};

//      const userFilter = {
//           role: USER_ROLES.USER,
//           status: 'active', // Exclude inactive users
//           isDeleted: false, // Exclude deleted users
//           ...searchFilter,
//      };

//      const pipeline: any[] = [
//           // Step 1: Filter users
//           { $match: userFilter },

//           // Step 2: Join with subscriptions
//           {
//                $lookup: {
//                     from: 'subscriptions',
//                     localField: '_id',
//                     foreignField: 'userId',
//                     as: 'subscriptions',
//                },
//           },

//           // Step 3: Sort subscriptions by createdAt descending
//           {
//                $addFields: {
//                     subscriptions: { $sortArray: { input: '$subscriptions', sortBy: { createdAt: -1 } } },
//                     latestSubscription: { $arrayElemAt: ['$subscriptions', 0] },
//                },
//           },

//           // Step 4: Filter by subscription status
//           {
//                $match:
//                     filterStatus === 'all'
//                          ? {} // no extra filtering
//                          : filterStatus === 'active'
//                            ? { 'latestSubscription.status': 'active' }
//                            : filterStatus === 'expired'
//                              ? { 'latestSubscription.expiryDate': { $lt: new Date() }, 'latestSubscription.status': 'expired' }
//                              : filterStatus === 'inactive'
//                                ? { latestSubscription: { $exists: false } }
//                                : {},
//           },

//           // Step 5: Project fields
//           {
//                $project: {
//                     image: 1,
//                     name: 1,
//                     email: 1,
//                     phoneNumber: '$phoneNumber',
//                     subscriptions: {
//                          $ifNull: [
//                               {
//                                    $cond: {
//                                         if: { $ifNull: ['$latestSubscription.status', false] },
//                                         then: {
//                                              $concat: [
//                                                   { $toUpper: { $substrCP: ['$latestSubscription.status', 0, 1] } },
//                                                   { $substrCP: ['$latestSubscription.status', 1, { $strLenCP: '$latestSubscription.status' }] },
//                                              ],
//                                         },
//                                         else: 'Inactive',
//                                    },
//                               },
//                               'Inactive',
//                          ],
//                     },
//                     StartDate: { $ifNull: ['$latestSubscription.createdAt', null] },
//                     EndDate: { $ifNull: ['$latestSubscription.expiryDate', null] },
//                },
//           },

//           // Step 6: Sort users by creation date
//           { $sort: { createdAt: -1 } },

//           // Step 7: Pagination
//           { $skip: skip },
//           { $limit: parseInt(limit) },
//      ];

//      const users = await User.aggregate(pipeline);

//      return users.map((u) => ({
//           ...u,
//           StartDate: u.StartDate ? new Date(u.StartDate).toDateString() : null,
//           EndDate: u.EndDate ? new Date(u.EndDate).toDateString() : null,
//      }));
// };

// update user profile
const updateProfileToDB = async (user: JwtPayload, payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
     const { id } = user;
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser && isExistUser.isDeleted === true) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     //unlink file here
     // if (payload.image) {
     //      deleteFileFromSpaces(isExistUser.image);
     // }

     const updateDoc = await User.findOneAndUpdate(
          { _id: id },
          { ...payload },
          {
               new: true,
          },
     );

     return updateDoc;
};

const verifyUserPassword = async (userId: string, password: string) => {
     const user = await User.findById(userId).select('+password');
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
     }
     const isPasswordValid = await User.isMatchPassword(password, user.password as string);
     return isPasswordValid;
};

const blockUserToDB = async (id: string) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }
     if (isExistUser.role === USER_ROLES.ADMIN) {
          throw new AppError(StatusCodes.BAD_REQUEST, "You don't have permission to delete this user!");
     }
     await User.findByIdAndUpdate(id, {
          $set: { status: 'blocked' },
     });

     return true;
};
const deleteUser = async (id: string) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }
     if (isExistUser.role === USER_ROLES.ADMIN) {
          throw new AppError(StatusCodes.BAD_REQUEST, "You don't have permission to block this user!");
     }
     await User.findByIdAndUpdate(id, {
          $set: { isDeleted: true },
     });

     return true;
};
export const UserService = {
     createUserToDB,
     getUserProfileFromDB,
     updateProfileToDB,
     deleteUser,
     verifyUserPassword,
     handleAppleAuthentication,
     handleGoogleAuthentication,
     // getUsersWithSubscriptionsFromDB,
     getUserFromDB,
     blockUserToDB,
};
