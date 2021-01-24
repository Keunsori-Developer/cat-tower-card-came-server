const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => {
    console.log(req.body);
    res.status(200);
    res.json("{\"a\":1}");
});
router.post('/userlist', (req, res) => {});
router.post('/active', (req, res) => {});

module.exports = router;