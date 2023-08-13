const express = require('express');
const {User} = require("../db/models");
const {decodeJwt} = require("jose");
const router = express.Router();

router.get('/login', function (req, res, next) {
    res.render('account/login', {title: 'Login'});
});

router.get('/register', function (req, res, next) {
    res.render('account/register', {title: 'Register'});
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
