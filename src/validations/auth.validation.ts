import Joi from 'joi';
import customValidator from '@/validations/utils/custom.validation';

const registration = {
  body: Joi.object().keys({
    firstname: Joi.string().required().trim(),
    lastname: Joi.string().required().trim(),
    email: Joi.string().required().email().trim(),
    password: Joi.string().required().custom(customValidator.password).trim(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email().trim(),
    password: Joi.string().required().custom(customValidator.password).trim(),
  }),
};

const verifyAccount = {
  body: Joi.object().keys({
    digits: Joi.string().required().min(5).max(6).trim(),
  }),
};

const sendVerificationCode = {
  body: Joi.object().keys({
    email: Joi.string().email().required().trim(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required().trim(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    code: Joi.string().required().trim(),
    password: Joi.string().required().custom(customValidator.password),
  }),
};

export default {
  registration,
  login,
  logout,
  verifyAccount,
  resetPassword,
  sendVerificationCode,
};
