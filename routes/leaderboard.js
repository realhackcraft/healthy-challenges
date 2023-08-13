const express = require('express');
const {User, JWT, sequelize, Score} = require("../db/models");
const {Op} = require("sequelize");
const {getTopFriends, getTopUsers} = require("../private/utils");
const router = express.Router();

router.get('/topAllTimeUser', async function (req, res, next) {
    const startDate = new Date();
    startDate.setDate(0);
    const endDate = new Date();

    res.json(await getTopUsers(req, res, startDate, endDate));
});

router.get('/topMonthlyUser', async function (req, res, next) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    res.json(await getTopUsers(req, res, startDate, endDate));
});

router.get('/topWeeklyUser', async function (req, res, next) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7);

    const endDate = new Date();

    res.json(await getTopUsers(req, res, startDate, endDate));
});

router.get('/topMonthlyFriend', async function (req, res, next) {
    const startDate = new Date();
    startDate.setDate(0);
    const endDate = new Date();

    res.json(await getTopFriends(req, res, startDate, endDate));
});

router.get('/topMonthlyFriend', async function (req, res, next) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    res.json(await getTopFriends(req, res, startDate, endDate));
});

router.get('/topWeeklyFriend', async function (req, res, next) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();

    res.json(await getTopFriends(req, res, startDate, endDate));
});

module.exports = router;
