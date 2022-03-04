import validator from 'validator';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { generateToken } from '../middlewares/auth.js';

const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users) {
      res.status(200).send(users);
    } else {
      res.status(ERROR_NOT_FOUND).send({ message: 'Пользователей не найдено' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Невалидный id' });
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const createUser = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create(req.body);
    res.send(user);
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

const updateProfile = async (req, res) => {
  try {
    // const id = req.user._id;
    const { name, about, _id } = req.body;
    const user = await User.findByIdAndUpdate(
      _id,
      { name, about },
      { new: true, runValidators: true }
    );
    if (user) {
      res.status(200).send(user);
    } else {
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(ERROR_CODE).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
      return;
    }
    if (error.name === 'CastError') {
      res.status(ERROR_CODE).send({
        message: 'Пользователь с указанным _id не найден',
      });
      return;
    }
    res.status(500).send({ message: error.message });
  }
};

const updateAvatar = async (req, res) => {
  try {
    // const id = req.user._id;
    const { avatar, _id } = req.body;
    const user = await User.findByIdAndUpdate(
      _id,
      { avatar },
      { new: true, runValidators: true }
    );
    if (user) {
      res.status(200).send(user);
    } else {
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(ERROR_CODE).send({
        message: 'Переданы некорректные данные при обновлении аватара',
      });
      return;
    }
    if (error.name === 'CastError') {
      res.status(ERROR_CODE).send({
        message: 'Пользователь с указанным _id не найден',
      });
      return;
    }
    res.status(500).send({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      res.status(ERROR_CODE).send({ message: 'Неправильные почта или пароль' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(ERROR_CODE).send({ message: 'Неправильные почта или пароль' });
    }

    const compare = bcrypt.compare(password, user.password);

    if (!compare) {
      res.status(ERROR_CODE).send({ message: 'Неправильные почта или пароль' });
    }

    const token = generateToken({ payload: user._id });

    res.send({ token });
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};

const getUserInfo = async (res, req) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Невалидный id' });
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

// eslint-disable-next-line object-curly-newline
export {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserInfo,
};
