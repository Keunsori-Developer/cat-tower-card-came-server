const express = require('express');
const create = require('../control/rooms/create.js');
const active = require('../control/rooms/active.js');
const join = require('../control/rooms/join.js');

const router = express.Router();

router.post('/create', create);

router.post('/userlist', (req, res) => {
    console.log(req.body);
    console.log("아직 미구현");
});
router.get('/active', active);
router.post('/join', join)

module.exports = router;