import { IUser } from '@/models/users/users.models';
import UserService from '@/services/user.service';
import { AppRes, catchAsync, httpStatus } from '@dolphjs/core';
import { Request, Response } from 'express';

class UserController {
  protected userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const user: IUser | null = await this.userService.getUserById(req.params.userId);
    if (!user) throw new AppRes(httpStatus.NOT_FOUND, 'user not found');
    user.password = null;
    res.status(httpStatus.OK).json({ data: user });
  });
}

export default UserController;
