import UserController from '@/controllers/user.controller';
import validate from '@/middlewares/validate.middleware';
import validateAcc from '@/middlewares/validateUser.middleware';
import userValidation from '@/validations/user.validation';
import { Router } from '@dolphjs/core';

class UserRoute {
  public path = '/api/v1/user';

  router = Router();

  controller = new UserController();

  constructor() {
    this.initializeRouter();
  }

  initializeRouter() {
    this.router.get(`${this.path}/:userId`, this.controller.getUserProfile);
    this.router.get(`${this.path}`, this.controller.queryUsers);
    this.router.patch(
      `${this.path}/update-password`,
      validateAcc,
      validate(userValidation.updatePassword),
      this.controller.updatePassword
    );
  }
}

export default UserRoute;
