import { addToRedis, getFromRedis } from '@/libs/redis.lib';
import Users from '@/models/users/users.models';
import { uniqueFiveDigits } from '@/utils/generateDigits.util';
import UserService from './user.service';
import { AppRes, httpStatus } from '@dolphjs/core';

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
}

export default AuthService;
