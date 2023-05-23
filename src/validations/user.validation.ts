import Joi from 'joi';
import customValidator from '@/validations/utils/custom.validation';

const updatePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required().custom(customValidator.password),
    newPassword: Joi.string().required().custom(customValidator.password),
  }),
};

export default {
  updatePassword,
};
