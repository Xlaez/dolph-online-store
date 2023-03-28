import { config } from 'dotenv';
import Joi from 'joi';
import path from 'path';

config({ path: path.join(__dirname, '../../.env') });

/**
 * Passes all the environmental variables into this object
 */

const envVariablesSchema = Joi.object()
  .keys({
    MONGO_URI: Joi.string().required().description('Mongo DB uri'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(60).description('minutes after which access tokens expire'),
    REDIS_URL: Joi.string().required().description('Redis Connection String'),
    CLOUDINARY_NAME: Joi.string().description('cloudinary account name'),
    CLOUDINARY_API_KEY: Joi.string().description('cloudinary api key'),
    CLOUDINARY_API_SECRET: Joi.string().description('cloudinary user secret'),
  })
  .unknown();

const { value: envVars, error } = envVariablesSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) throw new Error(`App Config Validation Error: ${error.message}`);

const mongoConfig = {
  mongoose: {
    url: envVars.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiration: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },
  redis: {
    url: envVars.REDIS_URL,
  },
  cloudinary: {
    name: envVars.CLOUDINARY_NAME,
    key: envVars.CLOUDINARY_API_KEY,
    secret: envVars.CLOUDINARY_API_SECRET,
  },
};

export default mongoConfig;
