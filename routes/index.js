const express = require('express');
const {User, Score} = require("../db/models");
const {decodeJwt} = require("jose");
const router = express.Router();

router.get('/', async function (req, res, next) {
    if (req.cookies.accessToken) {
        const username = decodeJwt(req.cookies.accessToken).username;
        const user = await User.findOne({
            where: {
                username: username
            }
        });
        res.render('index', {user: user});
    } else {
        res.render('index');

    }
});

module.exports = router;
