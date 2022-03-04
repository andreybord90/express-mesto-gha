import express from 'express';
import mongoose from 'mongoose';
import router from './src/routes/users.js';
import routerCards from './src/routes/cards.js';
import { createUser, login } from './src/controllers/users.js';
import { auth } from './src/middlewares/auth.js';

const { PORT = 3000 } = process.env;
const { connect } = mongoose;
const app = express();

connect('mongodb://localhost:27017/mestodb');
app.use(express.json());

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);
app.use('/', router);
app.use('/', routerCards);
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});
// app.use(errorHandler);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
