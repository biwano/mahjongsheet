const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  const player = res.M.Player();
  res.M.assign(player, req.body);
  player.save((err) => {

    res.json(res.M.response(err));
  });
});
module.exports = router;
