const express = require('express');
const bodyParser = require('body-parser');

const persistence = require('./middlewares/persistence.js');
const auth = require('./middlewares/auth.js');
const helpers = require('./middlewares/helpers.js');
const admin = require('./routes/admin.js');
const player = require('./routes/player.js');

const app = express();

const connection = persistence.connect();

connection.once('open', () => {
  app.use(helpers);
  app.use(bodyParser.json());
  app.use(persistence.router);
  app.use(auth(connection));

  app.use('/api/admin', admin);
  app.use('/api/player', player);

  // respond with "hello world" when a GET request is made to the homepage
  app.get('/', (req, res) => {
    res.send('hello world');
  });
});

app.listen(3000);
