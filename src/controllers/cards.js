import Cards from '../models/card.js';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../errors/index.js';

const getCards = async (req, res, next) => {
  try {
    const cards = await Cards.find({});
    if (cards) {
      res.status(200).send({ data: cards });
    } else {
      throw new NotFoundError('Пользователей не найдено');
    }
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const userId = req.user._id;
    const card = await Cards.create({ name, link, owner: userId });
    res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при создании карточки'
        )
      );
    } else {
      next(error);
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const id = req.params.cardId;
    await Cards.findById(id)
      .orFail(() => new NotFoundError('Карточка с указанным id не найдена'))
      .then((card) => {
        if (!card.owner.equals(req.user._id)) {
          return next(new ForbiddenError('Нельзя удалить чужую карточку'));
        }
        return card.remove().then(() => {
          res.send({ message: 'Карточка удалена' });
        });
      });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
    } else {
      next(error);
    }
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Cards.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (card) {
      res.status(200).send(card);
    } else {
      throw new NotFoundError('Карточка с указанным id не найдена');
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
    } else {
      next(error);
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Cards.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (card) {
      res.status(200).send(card);
    } else {
      throw new NotFoundError('Карточка с указанным id не найдена');
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
    } else {
      next(error);
    }
  }
};

// eslint-disable-next-line object-curly-newline
export { getCards, createCard, deleteCard, likeCard, dislikeCard };
