import AuthService from '@/services/auth.service';
import { catchAsync, httpStatus } from '@dolphjs/core';
import { Request, Response } from 'express';

class AuthController {
  protected userService: AuthService;

  constructor() {
    this.userService = new AuthService();
  }

  public registerUserByEmail = catchAsync(async (req: Request, res: Response) => {
    const result = await this.userService.createUser();
    res.status(httpStatus.CREATED).json(result);
  });
}

export default AuthController;
