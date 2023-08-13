const {User, Score} = require("../db/models");
const {Op} = require("sequelize");
const {decodeJwt} = require("jose");

async function getTopUsers(req, res, startDate, endDate, number) {
    const usersWithScores = await User.findAll({
        include: [
            {
                model: Score,
                attributes: ['score', 'createdAt'],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                required: false // Use "required: false" to get all users even if they have no scores
            }
        ],
        attributes: ['id', 'username']
    });

// Sort users based on the sum of scores within the time period
    usersWithScores.sort((userA, userB) => {
        const sumScoreA = userA.Scores.reduce((total, score) => total + score.score, 0);
        const sumScoreB = userB.Scores.reduce((total, score) => total + score.score, 0);
        return sumScoreB - sumScoreA;
    });

    usersWithScores.splice(number, usersWithScores.length - number)

    for (const users of usersWithScores) {
        users.totalScore = users.Scores.reduce((total, score) => total + score.score, 0);
    }

    return usersWithScores;
}

async function getTopFriends(req, res, startDate, endDate, number) {
    const authUsername = await decodeJwt(req.cookies.accessToken).username;

    const user = await User.findOne({
        where: {
            username: authUsername
        }
    });

    const friends = await user.getFriends({
        include: [
            {
                model: Score,
                attributes: ['score', 'createdAt'],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                required: false // Use "required: false" to get all users even if they have no scores
            }
        ],
        order: [
            [Score, 'createdAt', 'DESC']
        ]
    });

    friends.splice(number, friends.length - number)

    for (const friend of friends) {
        friend.totalScore = (await friend.getScores()).reduce((total, score) => total + score.score, 0);
    }

    return friends;
}

module.exports = {
    getTopUsers,
    getTopFriends
}
