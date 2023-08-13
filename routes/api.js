const express = require('express');
const {User, JWT} = require("../db/models");
const router = express.Router();
const jose = require('jose')
const {createJWT} = require('../private/jwtUtils');

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

    await User.create({
        username: username,
        password: password,
    });

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

module.exports = router;
