import { messages } from '@/constants/messages.constant';
import AuthService from '@/services/auth.service';
import MailSender from '@/services/email.service';
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

  public registerUserByEmail = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.createUser({ ...req.body });
    const digits = await this.authService.getVerificationCode(user._id);
    const mailSender = new MailSender(user.email, messages.validateAcc, {
      name: `${user.firstname} ${user.lastname}`,
      digits: digits.toString(),
      link: 'https://',
    });
    await mailSender.sendMail();
    res.status(httpStatus.CREATED).json({ message: 'user created' });
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

  public resendVerificationCode = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.userId);
    if (!user) throw new AppRes(httpStatus.NOT_FOUND, 'user not found');
    if (user.isAccountValid) throw new AppRes(httpStatus.BAD_REQUEST, 'your account has already been activated');
    const digits = await this.authService.getVerificationCode(req.params.userId);
    const mailSender = new MailSender(user.email, messages.validateAcc, {
      name: `${user.firstname} ${user.lastname}`,
      digits: digits.toString(),
      link: 'https://',
    });
    await mailSender.sendMail();
    res.status(httpStatus.OK).json({ msg: 'success' });
  });

  public logout = catchAsync(async (req: Request, res: Response) => {
    await this.authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public refreshTokens = catchAsync(async (req: Request, res: Response) => {
    const tokens = await this.authService.refreshTokens(req.body.refreshToken);
    res.status(httpStatus.OK).json({ ...tokens });
  });

  public forgetPassword = catchAsync(async (req: Request, res: Response) => {});
}

export default AuthController;
