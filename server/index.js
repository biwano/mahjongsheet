const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const model = require('./middlewares/model.js');
const admin = require('./routes/admin.js');
const player = require('./routes/player.js');

const app = express();

model.connect();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(model.router);
app.use('/api/admin', admin);
app.use('/api/player', player);

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(3000);
