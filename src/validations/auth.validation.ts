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

export default {
  registration,
  login,
  verifyAccount,
};
