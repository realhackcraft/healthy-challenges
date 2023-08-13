const express = require('express');
const {User, JWT} = require("../db/models");
const router = express.Router();
const jose = require('jose')
const {createJWT} = require('../private/jwtUtils');
const {decodeJwt} = require("jose");

router.post('/register', async function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return;
    }

    const existingUsers = await User.findAll({
        where: {
            username: username
        }
    })


    if (existingUsers.length > 0) {
        res.render('account/register', {title: 'Register', error: 'Username already exists'});
        return;
    }

    const user = await User.create({
        username: username,
        password: password,
    });

    user.addFriend(user);

    const token = await createJWT({username});

    res.cookie('accessToken', token.accessToken, {httpOnly: true});
    res.cookie('refreshToken', token.refreshToken, {httpOnly: true});

    await JWT.create({
        refreshToken: token.refreshToken,
    });

    res.redirect('/challenge/both/2');
});

router.post('/login', async function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return;
    }

    const existingUsers = await User.findAll({
        where: {
            username: username,
            password: password,
        }
    });

    if (existingUsers.length !== 1) {
        return;
    }

    await JWT.destroy({where: {refreshToken: req.cookies.refreshToken}})

    const token = await createJWT({username});

    res.cookie('accessToken', token.accessToken, {httpOnly: true});
    res.cookie('refreshToken', token.refreshToken, {httpOnly: true});

    await JWT.create({
        refreshToken: token.refreshToken,
    });

    res.send('ok');
});

router.post('/friends/add', async function (req, res, next) {
    const user = await User.findOne({
        where: {username: await decodeJwt(req.cookies.accessToken).username},
        include: [
            {
                model: User,
                as: 'Friends',
                attributes: ['username'],
            }
        ]
    });

    const futureFriend = await User.findOne({
        where: {username: req.body.friendName},
    });

    if (!futureFriend) {
        return;
    }

    if (user.username === futureFriend.username) {
        return;
    }

    if (user.Friends.map(friend => friend.username).includes(futureFriend.username)) {
        return;
    }

    const friendsNames = user.Friends.map(friend => friend.username);

    if (friendsNames.includes(futureFriend.username)) {
        return;
    }

    user.addFriend(futureFriend);
    futureFriend.addFriend(user);

    res.send('ok');
});

router.post('/friends/remove', async function (req, res, next) {
    const user = await User.findOne({
        where: {username: await decodeJwt(req.cookies.accessToken).username},
        include: [
            {
                model: User,
                as: 'Friends',
                attributes: ['username'],
            }
        ]
    });

    const friend = await User.findOne({
        where: {username: req.body.friendName},
    });

    if (!friend) {
        res.status(404).send('Friend not found');
    }

    await user.removeFriend(friend);
    await friend.removeFriend(user);

    res.send('ok');
});

module.exports = router;
