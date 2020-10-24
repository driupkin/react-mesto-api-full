const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
// GET /cards
module.exports.getCard = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};
// POST /cards
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.status(201).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${err.message}`));
      }
      return next(err);
    });
};
// DELETE /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена.');
      }
      if (req.user._id === String(card.owner._id)) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((cards) => res.status(200).send(cards));
      }
      throw new ForbiddenError('Нельзя удалять чужие карточки!');
    })
    .catch(next);
};
// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточка с таким id не найдена.');
      }
      res.status(200).send(cards);
    })
    .catch(next);
};
// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточка с таким id не найдена.');
      }
      res.status(200).send(cards);
    })
    .catch(next);
};
