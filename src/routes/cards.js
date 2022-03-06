import express from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards.js';

import {
  validateCreateCard,
  validateCardId,
} from '../middlewares/validatons.js';

const router = express.Router();

router.get('/cards', getCards);
router.post('/cards', validateCreateCard, express.json(), createCard);
router.delete('/cards/:cardId', validateCardId, deleteCard);
router.put('/cards/:cardId/likes', validateCardId, likeCard);
router.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

// module.exports = router;
export default router;
