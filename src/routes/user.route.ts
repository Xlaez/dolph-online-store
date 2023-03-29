import UserController from '@/controllers/user.controller';
import validate from '@/middlewares/validate.middleware';
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
  }
}

export default UserRoute;
