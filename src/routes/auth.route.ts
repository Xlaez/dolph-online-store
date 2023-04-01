import AuthController from '@/controllers/auth.controller';
import validate from '@/middlewares/validate.middleware';
import authValidator from '@/validations/auth.validation';
import { Router } from '@dolphjs/core';

class AuthRoute {
  public path = '/api/v1/auth';

  router = Router();

  controller = new AuthController();

  constructor() {
    this.initializeRouter();
  }

  initializeRouter() {
    this.router.post(`${this.path}/register`, validate(authValidator.registration), this.controller.registerUserByEmail);
    this.router.post(`${this.path}/login`, validate(authValidator.login), this.controller.loginWithEmail);
    this.router.post(`${this.path}/verify-account`, validate(authValidator.verifyAccount), this.controller.verifyAccount);
    this.router.post(
      `${this.path}/send-verification-code`,
      validate(authValidator.sendVerificationCode),
      this.controller.resendVerificationCode
    );
    this.router.post(`${this.path}/logout`, validate(authValidator.logout), this.controller.logout);
    this.router.post(`${this.path}/refresh-token`, validate(authValidator.logout), this.controller.refreshTokens);
    this.router.post(`${this.path}/forget-password`, validate(authValidator.sendVerificationCode));
    this.router.patch(`${this.path}/reset-password`, validate(authValidator.resetPassword), this.controller.resetPassword);
  }
}

export default AuthRoute;
