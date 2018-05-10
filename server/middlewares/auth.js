const express = require('express');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);

function createRouter(connection) {
  const router = express.Router();
  // Sessions
  router.use(session({
    secret: 'the secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new MongoStore({ mongooseConnection: connection }),
    collection: 'session',
  }));

  // Injecting connected user
  router.use(async (req, res, next) => {
    try {
      if (!req.session.user) {
        // Creating user in database
        req.session.user = await res.M.User().save();
      }
      // Injecting
      req.user = req.session.user;
      next();
    } catch (err) {
      // Oups!
      res.sendResponse('error persisting user');
    }
  });

  // Configuring Cors
  const corsOptions = { origin: true, credentials: true };
  router.use(cors(corsOptions));
  router.options('*', cors(corsOptions));
  return router;
}

module.exports = createRouter;

