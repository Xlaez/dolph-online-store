import Joi from 'joi';
import customValidator from '@/validations/utils/custom.validation';

const registration = {
  body: Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(customValidator.password),
  }),
};

export default {
  registration,
};
