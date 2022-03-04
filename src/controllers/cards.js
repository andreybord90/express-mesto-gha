import Cards from '../models/card.js';

const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;

const getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const userId = req.user._id;
    const card = await Cards.create({ name, link, owner: userId });
    res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(ERROR_CODE).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
      return;
    }
    res.status(500).send({ message: error.message });
  }
};

const deleteCard = async (req, res) => {
  try {
    const id = req.params.cardId;
    const card = await Cards.findByIdAndRemove(id);
    if (card) {
      res.status(200).send(card);
    } else {
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Карточка с указанным id не найдена.' });
      return;
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Невалидный id ' });
      return;
    }
    res.status(500).send({ message: error.message });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Cards.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (card) {
      res.status(200).send(card);
    } else {
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Карточка с указанным id не найдена.' });
      return;
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(ERROR_CODE).send({
        message: 'Передан несуществующий _id карточки',
      });
      return;
    }
    res.status(500).send({ message: error.message });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Cards.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (card) {
      res.status(200).send(card);
    } else {
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Карточка с указанным id не найдена.' });
      return;
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(ERROR_CODE).send({
        message: 'Передан несуществующий _id карточки',
      });
      return;
    }
    res.status(500).send({ message: error.message });
  }
};

// eslint-disable-next-line object-curly-newline
export { getCards, createCard, deleteCard, likeCard, dislikeCard };
