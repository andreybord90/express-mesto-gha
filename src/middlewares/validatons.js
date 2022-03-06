/* eslint-disable no-useless-escape */
import { celebrate, Joi } from 'celebrate';
import Shema from 'mongoose';

export const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (Shema.Types.ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Невалидный id');
      }),
  }),
});
export const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (Shema.Types.ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Невалидный id');
      }),
  }),
});

export const validateBodyUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    _id: Joi.string().alphanum().length(24),
  }),
});

export const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    ),
    _id: Joi.string().alphanum().length(24),
  }),
});

export const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .pattern(
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
      ),
  }),
});

export const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    ),
    email: Joi.string()
      .required()
      .pattern(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+[A-Z]{2,4}$/i),
    password: Joi.string().required(),
  }),
});
export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .pattern(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+[A-Z]{2,4}$/i),
    password: Joi.string().required(),
  }),
});
