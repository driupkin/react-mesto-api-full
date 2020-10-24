const router = require('express').Router();
const {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validationDelLickeDislikeCard,
  validationCreateCard,
} = require('../middlewares/requestValidation');

router.get('/cards', getCard);
router.post('/cards', validationCreateCard, createCard);
router.delete('/cards/:cardId', validationDelLickeDislikeCard, deleteCard);
router.put('/cards/:cardId/likes', validationDelLickeDislikeCard, likeCard);
router.delete('/cards/:cardId/likes', validationDelLickeDislikeCard, dislikeCard);

module.exports = router;
