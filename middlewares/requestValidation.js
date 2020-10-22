const { celebrate, Joi } = require('celebrate');

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  }).unknown(true),
});
const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(3).max(30)
      .required(),
    about: Joi.string().required().min(2).max(30),
  }),
});
const validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
});
const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri(),
  }),
});

module.exports = {
  validationCreateUser,
  validationUpdateUser,
  validationUpdateAvatar,
  validationCreateCard,
};
