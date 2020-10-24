const { celebrate, Joi } = require('celebrate');

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  }).unknown(true),
});
const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
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
const validationDelLickeDislikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});
const validationGetUser = celebrate({
  headers: Joi.object().keys({
    Authorization: Joi.string().token(),
  }),
});

module.exports = {
  validationCreateUser,
  validationUpdateUser,
  validationUpdateAvatar,
  validationCreateCard,
  validationDelLickeDislikeCard,
  validationGetUser,
};
