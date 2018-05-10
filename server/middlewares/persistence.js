const express = require('express');
const mongoose = require('mongoose');
const Player = require('./playerModel');
const User = require('./userModel');

const router = express.Router();

const Model = {};
Model.Player = Player;
Model.User = User;
Model.assign = function assign(destination, source) {
  const dest = destination;
  Object.keys(source).forEach((key) => {
    dest[key] = source[key];
  });
};

router.use((req, res, next) => {
  res.M = Model;
  next();
});

const connect = function connect(callback) {
  mongoose.connect('mongodb://localhost/test');
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  const $callback = callback || (() => {});
  return db;
};

module.exports = { router, connect };

