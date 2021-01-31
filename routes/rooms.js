const express = require('express');
const create = require('../control/rooms/create.js');
const active = require('../control/rooms/active.js');

const router = express.Router();

router.post('/create', create);

router.post('/userlist', (req, res) => {
    console.log(req.body);
    console.log("아직 미구현");
});
router.get('/active', active);

module.exports = router;