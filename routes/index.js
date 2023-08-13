const express = require('express');
const router = express.Router();

router.get('/challenge/:type/:count', function (req, res, next) {
    console.log(req.cookies)
    res.render('challenge/challenge', {count: req.params.count, type: req.params.type});
});

module.exports = router;
