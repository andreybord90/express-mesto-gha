/* eslint-disable object-curly-newline */
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { generateToken } from '../middlewares/auth.js';
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from '../errors/index.js';

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users) {
      res.status(200).send(users);
    } else {
      throw new NotFoundError('Пользователей не найдено');
    }
  } catch (error) {
    next('Произошла ошибка');
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Невалидный id'));
    }
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, password, email } = req.body;
    User.findOne({ email })
      .then((user) => {
        if (user) {
          throw new ConflictError('Пользователь с данным email существует');
        } else {
          return bcrypt.hash(password, 10);
        }
      })
      .then((hash) => {
        User.create({ name, about, avatar, password: hash, email });
      })
      .then((user) => {
        res.send(user);
      });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при создании пользователя'
        )
      );
    }
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, about, _id } = req.body;
    const user = await User.findByIdAndUpdate(
      _id,
      { name, about },
      { new: true, runValidators: true }
    );
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при создании пользователя'
        )
      );
    }
    if (error.name === 'CastError') {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
    }
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
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
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new BadRequestError(
        'Переданы некорректные данные при обновлении аватара'
      );
    }
    if (error.name === 'CastError') {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new BadRequestError('Неправильные почта или пароль');
    }

    const compare = bcrypt.compare(password, user.password);

    if (!compare) {
      throw new BadRequestError('Неправильные почта или пароль');
    }

    const token = generateToken({ payload: user._id });

    res.send({ token });
  } catch (error) {
    next(new UnauthorizedError('Ошибка авторизации'));
  }
};

const getUserInfo = async (res, req, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
    }
    next(new UnauthorizedError('Произошла ошибка'));
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
