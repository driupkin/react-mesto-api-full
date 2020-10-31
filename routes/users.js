const router = require('express').Router();
const {
  getUser,
  getUsers,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  validationUpdateUser,
  validationUpdateAvatar,
  validationGetUser,
  validationGetUserId,
} = require('../middlewares/requestValidation');

router.get('/users/me', validationGetUser, getUser);
router.get('/users', getUsers);
router.get('/users/:id', validationGetUserId, getUserId);
router.patch('/users/me', validationUpdateUser, updateUser);
router.patch('/users/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
