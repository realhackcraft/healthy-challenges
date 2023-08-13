const express = require('express');
const {User, JWT, sequelize, Score} = require("../db/models");
const {Op} = require("sequelize");
const {getTopUsers, getTopFriends} = require("../private/utils");
const router = express.Router();

router.get('/', async function (req, res, next) {
    res.render('leaderboard', {title: 'Leaderboard'});
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
