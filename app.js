import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import router from './src/routes/users.js';
import routerCards from './src/routes/cards.js';
import { createUser, login } from './src/controllers/users.js';
import { errorHandler } from './src/middlewares/errors-handler.js';
import { auth } from './src/middlewares/auth.js';
import {
  validateCreateUser,
  validateLogin,
} from './src/middlewares/validatons.js';
import { NotFoundError } from './src/errors/index.js';

const { PORT = 3000 } = process.env;
const { connect } = mongoose;
const app = express();

connect('mongodb://localhost:27017/mestodb');
app.use(express.json());

app.post('/signup', validateCreateUser, createUser);
app.post('/signin', validateLogin, login);

app.use(auth);
app.use('/', router);
app.use('/', routerCards);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
