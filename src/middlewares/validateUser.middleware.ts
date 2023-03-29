import { AppRes, catchAsync, httpStatus } from '@dolphjs/core';
import { NextFunction, Request, Response } from 'express';
import config from '@/configs';
import { verify } from 'jsonwebtoken';
import UserService from '@/services/user.service';

const userService = new UserService();

const validateAcc = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['x-auth-token'];
  if (!token) return next(new AppRes(httpStatus.UNAUTHORIZED, 'provide a valid token header'));

  if (typeof token !== 'string') {
    return next(new AppRes(httpStatus.UNAUTHORIZED, 'provide a valid token type'));
  }

  try {
    const payload = verify(token, config.jwt.secret);
    // remeber to remove unimportant parts of the user data to increase performance
    const user = await userService.getUserById(payload.sub);
    // add current user to req body
    user.password = null;
    req.user = user;
    next();
  } catch (e) {
    next(new AppRes(httpStatus.SERVICE_UNAVAILABLE, e.message));
  }
});

export default validateAcc;
