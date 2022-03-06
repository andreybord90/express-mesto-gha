import express from 'express';

import {
  getUsers,
  getUserById,
  getUserInfo,
  updateProfile,
  updateAvatar,
} from '../controllers/users.js';
import {
  validateUserId,
  validateBodyUpdateProfile,
  validateAvatar,
} from '../middlewares/validatons.js';

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/me', validateUserId, getUserInfo);
router.get('/users/:userId', validateUserId, getUserById);
router.patch('/users/me', validateBodyUpdateProfile, updateProfile);
router.patch('/users/me/avatar', validateAvatar, updateAvatar);

// module.exports = router;
export default router;
