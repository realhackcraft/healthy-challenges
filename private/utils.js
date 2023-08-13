const {User, Score} = require("../db/models");
const {Op} = require("sequelize");
const {decodeJwt} = require("jose");

async function getTopUsers(req, res, startDate, endDate) {
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

    for (const users of usersWithScores) {
        users.totalScore = users.Scores.reduce((total, score) => total + score.score, 0);
    }

    return usersWithScores;
}

async function getTopFriends(req, res, startDate, endDate) {
    const authUserId = req.user.id;
    const authUser = await User.findOne({
        where: {
            id: authUserId
        },
        include: [
            {
                model: User,
                as: 'Friends',
                attributes: ['id', 'username'],
                include: [
                    {
                        model: Score,
                        where: {
                            createdAt: {
                                [Op.between]: [startDate, endDate]
                            }
                        },
                    }
                ],
            }
        ]
    });

    authUser.Friends.sort((userA, userB) => {
        const sumScoreA = userA.Scores.reduce((total, score) => total + score.score, 0);
        const sumScoreB = userB.Scores.reduce((total, score) => total + score.score, 0);
        return sumScoreB - sumScoreA;
    });

    for (const friend of authUser.Friends) {
        friend.totalScore = friend.Scores.reduce((total, score) => total + score.score, 0);
    }

    return authUser.Friends;
}

module.exports = {
    getTopUsers,
    getTopFriends
}
