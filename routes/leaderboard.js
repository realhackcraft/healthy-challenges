const express = require('express');
const {getTopUsers, getTopFriends} = require("../private/utils");
const {decodeJwt} = require("jose");
const {User} = require("../db/models");
const router = express.Router();

router.get('/', async function (req, res, next) {
    const username = (await decodeJwt(req.cookies.accessToken)).username;
    const user = await User.findOne({
        where: {
            username: username
        }
    });
    res.render('leaderboard', {title: 'Leaderboard', user: user});
});

router.get('/topUsers', async function (req, res, next) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    res.json(await getTopUsers(req, res, startDate, endDate, 10));
});

router.get('/topMonthlyUsers', async function (req, res, next) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    res.json(await getTopUsers(req, res, startDate, endDate, 10));
});

router.get('/topWeeklyUsers', async function (req, res, next) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7);

    const endDate = new Date();

    res.json(await getTopUsers(req, res, startDate, endDate, 10));
});

router.get('/topFriends', async function (req, res, next) {
    const startDate = new Date();
    startDate.setDate(0);
    const endDate = new Date();

    res.json(await getTopFriends(req, res, startDate, endDate, 10));
});

router.get('/topMonthlyFriends', async function (req, res, next) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    res.json(await getTopFriends(req, res, startDate, endDate, 10));
});

router.get('/topWeeklyFriends', async function (req, res, next) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();

    res.json(await getTopFriends(req, res, startDate, endDate, 10));
});

module.exports = router;
