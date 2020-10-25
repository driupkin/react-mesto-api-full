const router = require('express').Router();
const {
  getUser,
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  validationUpdateUser,
  validationUpdateAvatar,
  validationCreateUser,
  validationGetUser,
  validationGetUserId,
} = require('../middlewares/requestValidation');

router.get('/users/me', validationGetUser, getUser);
router.get('/users', getUsers);
router.get('/users/:id', validationGetUserId, getUserId);
router.post('/users', validationCreateUser, createUser);
router.patch('/users/me', validationUpdateUser, updateUser);
router.patch('/users/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
