const express = require('express');
const {User, JWT} = require("../db/models");
const {decodeJwt} = require("jose");
const router = express.Router();

router.get('/login', function (req, res, next) {
    res.render('account/login', {title: 'Login'});
});

router.get('/register', function (req, res, next) {
    res.render('account/register', {title: 'Register'});
});


router.get('/logout', async function (req, res, next) {
    const username = decodeJwt(req.cookies.accessToken).username;

    const user = await User.findOne({
        where: {
            username
        }
    });

    if (!user) {
        res.sendStatus(401);
        return;
    }

    if (!req.cookies.refreshToken) {
        res.sendStatus(401);
        return;
    }

    await JWT.destroy({
        where: {
            refreshToken: req.cookies.refreshToken
        }
    });

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.redirect('/');
});

router.get('/:username', async function (req, res, next) {
    const user = await User.findOne(
        {
            where: {username: req.params.username},
            include: [
                {
                    model: User,
                    as: 'Friends',
                    attributes: ['username']
                }],
        });

    let friendNames = user.Friends.map(friend => friend.username);

    const thisUser = await User.findOne({where: {username: (await decodeJwt(req.cookies.accessToken)).username}});

    res.render('account/profile', {title: 'Profile', user, thisUser, friendNames});
});

module.exports = router;
