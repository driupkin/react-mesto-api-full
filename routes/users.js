const router = require('express').Router();
const {
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
} = require('../middlewares/requestValidation');

router.get('/users/me', validationGetUser, getUsers);
router.get('/users/:id', getUserId);
router.post('/users', validationCreateUser, createUser);
router.patch('/users/me', validationUpdateUser, updateUser);
router.patch('/users/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
