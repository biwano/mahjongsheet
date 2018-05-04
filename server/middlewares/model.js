const express = require('express');
const mongoose = require('mongoose');
const Player = require('./playerModel');
const User = require('./userModel');

const router = express.Router();

const M = {};
M.Player = Player;
M.User = User;
M.assign = function assign(destination, source) {
  const dest = destination;
  Object.keys(source).forEach((key) => {
    dest[key] = source[key];
  });
};
M.response = function response(err) {
  const status = err ? 'ko' : 'ok';
  return { status };
};

router.use((req, res, next) => {
  res.M = M;
  next();
});

const connect = function connect(callback) {
  mongoose.connect('mongodb://localhost/test');
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  const $callback = callback || (() => {});
  db.once('open', $callback);
};

module.exports = { router, connect };

