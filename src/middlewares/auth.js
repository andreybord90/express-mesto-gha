import jwt from 'jsonwebtoken';

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(403).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(403).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};

const generateToken = (payload) => {
  const token = jwt.sign(
    payload,
    NODE_ENV === 'production' ? JWT_SECRET : 'salsome-secret-keyt',
    { expiresIn: '7d' }
  );
  return token;
};

export { auth, generateToken };
