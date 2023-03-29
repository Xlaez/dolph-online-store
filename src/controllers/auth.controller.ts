import AuthService from '@/services/auth.service';
import UserService from '@/services/user.service';
import { catchAsync, httpStatus } from '@dolphjs/core';
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
    res.status(httpStatus.CREATED).json({ data: user });
  });
}

export default AuthController;
