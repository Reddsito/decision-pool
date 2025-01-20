import * as Joi from 'joi';

export const validationEnvSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  PORT: Joi.number().default(3005),
  CLIENT_PORT: Joi.number().default(3000),
});
