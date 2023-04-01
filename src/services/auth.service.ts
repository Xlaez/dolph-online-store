import { addToRedis, getFromRedis } from '@/libs/redis.lib';
import Users from '@/models/users/users.models';
import { uniqueFiveDigits } from '@/utils/generateDigits.util';
import UserService from './user.service';
import { AppRes, httpStatus } from '@dolphjs/core';
import Tokens from '@/models/token.model';
import tokenTypes from '@/configs/tokenTypes';
import TokenService from './token.service';

class AuthService {
  protected userModel: typeof Users;
  protected userService: UserService;

  constructor() {
    this.userModel = Users;
    this.userService = new UserService();
  }

  public createUser = async () => {
    return 'Hello there user';
  };

  public getVerificationCode = async (userId: string) => {
    const digits = uniqueFiveDigits();
    await addToRedis(digits.toString(), userId.toString(), 60 * 60 * 3);
    return digits;
  };

  public loginWithEmail = async (email: string, password: string) => {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await user.doesPasswordMatch(password))) {
      throw new AppRes(httpStatus.UNAUTHORIZED, 'incorrect email or password');
    }
    user.password = null;
    return user;
  };

  public verifyAccount = async (digits: string) => {
    const userId = await getFromRedis(digits);
    if (!userId) throw new AppRes(httpStatus.NOT_FOUND, 'request for verification code again');
    return userId;
  };

  public logout = async (refreshToken: string) => {
    const refreshTokenDoc = await Tokens.findOne({ token: refreshToken, type: tokenTypes.refresh, blacklisted: false });
    if (!refreshTokenDoc) throw new AppRes(httpStatus.NOT_FOUND, 'token not found');
    await refreshTokenDoc.remove();
  };

  public refreshTokens = async (refreshToken: string) => {
    try {
      const refreshTokenDoc = await TokenService.verifyToken(refreshToken, tokenTypes.refresh);
      const user = await this.userService.getUserById(refreshTokenDoc.user);
      if (!user) throw new AppRes(httpStatus.NOT_FOUND, 'user not found');
      await refreshTokenDoc.remove();
      return TokenService.generateAuthTokens(user);
    } catch (e) {
      throw new AppRes(httpStatus.UNAUTHORIZED, 'please authenticate');
    }
  };
}

export default AuthService;
