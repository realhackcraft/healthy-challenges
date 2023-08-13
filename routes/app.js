const express = require('express');
const {User, Score} = require("../db/models");
const {decodeJwt} = require("jose");
const router = express.Router();
router.get('/challenge/:type/:count', function (req, res, next) {
    res.render('challenge/challenge', {count: req.params.count, type: req.params.type});
});

router.post('/submit', async function (req, res, next) {
    const username = (await decodeJwt(req.cookies.accessToken)).username;
    const user = await User.findOne({
        where: {
            username: username
        }
    });
    await Score.create({
        userId: user.id,
        score: req.query.count,
    });
});

module.exports = router;
