import AuthController from '@/controllers/auth.controller';
import { Router } from '@dolphjs/core';

class AuthRoute {
  public path = '/api/v1/auth';

  router = Router();

  controller = new AuthController();

  constructor() {
    this.initializeRouter();
  }

  initializeRouter() {
    this.router.post(`${this.path}/register`, this.controller.registerUserByEmail);
  }
}

export default AuthRoute;
