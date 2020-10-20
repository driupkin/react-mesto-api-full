const Card = require('../models/card');
// GET /cards
module.exports.getCard = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
// POST /cards
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.status(201).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
// DELETE /cards/:cardId
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail()
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(404).send({ message: 'Карточка с таким id не найдена.' });
    });
};
// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).orFail()
  .then((cards) => res.status(200).send(cards))
  .catch(() => {
    res.status(404).send({ message: 'Карточка с таким id не найдена.' });
  });
// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).orFail()
  .then((cards) => res.status(200).send(cards))
  .catch(() => {
    res.status(404).send({ message: 'Карточка с таким id не найдена.' });
  });
