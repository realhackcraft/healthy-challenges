const express = require('express');
const {Point, User, Score} = require("../db/models");
const router = express.Router();

router.get('/', function (req, res, next) {
    res.redirect('/leaderboard');
});

router.get('/challenge/:type/:count', function (req, res, next) {
    res.render('challenge/challenge', {count: req.params.count, type: req.params.type});
});

router.post('/submit', async function (req, res, next) {
    await Score.create({
        userId: req.user.id,
        score: 100,
        timestamp: new Date()
    });
});
module.exports = router;
