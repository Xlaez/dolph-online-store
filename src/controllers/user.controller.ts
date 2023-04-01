import { IUser } from '@/models/users/users.models';
import UserService from '@/services/user.service';
import { AppRes, catchAsync, httpStatus } from '@dolphjs/core';
import { hashSync } from 'bcryptjs';
import { Request, Response } from 'express';

class UserController {
  protected userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const user: IUser | null = await this.userService.getUserById(req.params.userId);
    if (!user) throw new AppRes(httpStatus.NOT_FOUND, 'user not found');
    res.status(httpStatus.OK).json({ data: user });
  });

  public updatePassword = catchAsync(async (req: Request, res: Response) => {
    //@ts-ignore
    const user = await this.userService.getUserById(req.user.id);
    if (!(await user.doesPasswordMatch(req.body.oldPassword)))
      throw new AppRes(httpStatus.BAD_REQUEST, 'password does not match');
    await this.userService.updateUserByCustom({ _id: user.id }, { password: hashSync(req.body.newPassword, 11) });
    res.status(httpStatus.OK).json({ msg: 'updated' });
  });
}

export default UserController;
