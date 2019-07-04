/* eslint-disable no-console */
/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

// importar modelo UserSchema
const UserSchema = require('./models/User');

const { port, mongoUrl, secret } = config;
const app = express();


// Conectar aplicación a MongoDB
mongoose.connect(mongoUrl, { useNewUrlParser: true });


app.set('config', config);
app.set('pkg', pkg);


app.use(express.json());
app.use(authMiddleware(secret));

// utilizar get para obtener información del modelo (ver todas las tareas)
app.get('/User', (req, res) => {
  UserSchema
    .find({})
    .exec()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.error(error);
      res.json(users);
    });
});

// Utilizar post para agregar un usuario
app.post('/NewUser', (req, res) => {
  const newUser = new UserSchema({
    email: req.body.email,
    password: req.body.password,
    roles: 'admin',
  });
  newUser
    .save()
    .then((saveNewUser) => {
      res.json(saveNewUser);
    })
    .catch((error) => {
      console.error(error);
      res.status = 500;
      res.json({
        message: error.message,
      });
    });
});


// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  // Registro de "middleware" que maneja posibles errores
  app.use(errorHandler);

  app.listen(port, () => console.log(`App listening on port ${port}`));
});
