const express = require('express');
const create = require('../control/rooms/create.js');
const active = require('../control/rooms/active.js');
const join = require('../control/rooms/join.js');
const userlist = require('../control/rooms/userlist.js');

const router = express.Router();

router.post('/create', create);
router.post('/userlist',userlist);
router.get('/active', active);
router.post('/join', join)

module.exports = router;