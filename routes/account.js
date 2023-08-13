const express = require('express');
const router = express.Router();

router.get('/login', function (req, res, next) {
    res.render('account/login', {title: 'Login'});
});

router.get('/register', function (req, res, next) {
    res.render('account/register', {title: 'Register'});
});

module.exports = router;
