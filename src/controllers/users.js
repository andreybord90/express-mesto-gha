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
    next(error);
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
    } else {
      next(error);
    }
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, password, email } = req.body;
    await User.findOne({ email })
      .then((user) => {
        if (user) {
          throw new ConflictError('Пользователь с данным email существует');
        } else {
          return bcrypt.hash(password, 10);
        }
      })
      // eslint-disable-next-line arrow-body-style
      .then((hash) => {
        return User.create({ name, about, avatar, password: hash, email });
      })
      .then((user) => {
        res.send(user);
        // res.status(200).send({ data: {name, about, avatar, email} })
      });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при создании пользователя'
        )
      );
    } else {
      next(error);
    }
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, about } = req.body;
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
    } else if (error.name === 'CastError') {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
    } else {
      next(error);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { avatar } = req.body;
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
      next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении аватара'
        )
      );
    } else if (error.name === 'CastError') {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
    } else {
      next(error);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const token = generateToken({ _id: user._id });

    res.send({ token });
  } catch (error) {
    next(new UnauthorizedError('Неправильные почта или пароль'));
  }
};

const getUserInfo = async (res, req, next) => {
  try {
    const user = await User.findById(req.user._id);
    console.log('data', req.user);
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
    } else {
      next(new UnauthorizedError('Произошла ошибка'));
    }
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
