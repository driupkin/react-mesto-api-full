const { celebrate, Joi } = require('celebrate');

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password:
      Joi.string()
        .required()
        .min(8)
        .pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])')),
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
    avatar: Joi.string().pattern(new RegExp('https?:\/\/.*\.(?:png|jpg|jpeg)')),
  }),
});
const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(new RegExp('https?:\/\/.*\.(?:png|jpg|jpeg)')),
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
const validationGetUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validationCreateUser,
  validationUpdateUser,
  validationUpdateAvatar,
  validationCreateCard,
  validationDelLickeDislikeCard,
  validationGetUser,
  validationGetUserId,
};
