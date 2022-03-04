import express from 'express';
import {
  getUsers,
  getUserById,
  getUserInfo,
  updateProfile,
  updateAvatar,
} from '../controllers/users.js';

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.get('/users/me', getUserInfo);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

// module.exports = router;
export default router;
