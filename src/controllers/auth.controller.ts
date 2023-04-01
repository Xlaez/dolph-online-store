import AuthService from '@/services/auth.service';
import TokenService from '@/services/token.service';
import UserService from '@/services/user.service';
import { AppRes, catchAsync, httpStatus } from '@dolphjs/core';
import { Request, Response } from 'express';

class AuthController {
  protected authService: AuthService;
  protected userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  /**
   * TODO: send digits in an email
   */
  public registerUserByEmail = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.createUser({ ...req.body });
    const digits = await this.authService.getVerificationCode(user._id);
    const data = { user, digits };
    res.status(httpStatus.CREATED).json(data);
  });

  public loginWithEmail = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this.authService.loginWithEmail(email, password);
    const tokens = await TokenService.generateAuthTokens(user);
    res.status(httpStatus.OK).json({ data: { user, tokens } });
  });

  public verifyAccount = catchAsync(async (req: Request, res: Response) => {
    const { digits } = req.body;
    const userId = await this.authService.verifyAccount(digits);
    if (!this.userService.getUserById(userId)) throw new AppRes(httpStatus.BAD_REQUEST, 'code has expired or is wrong');
    await this.userService.updateUserByCustom({ _id: userId }, { isAccountValid: true });
    res.status(httpStatus.OK).json({ msg: 'success' });
  });
}

export default AuthController;
