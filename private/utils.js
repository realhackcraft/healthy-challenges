const {User, Score} = require("../db/models");
const {Op} = require("sequelize");

async function getTopUsers(res, req, startDate, endDate) {
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

    usersWithScores.sort((userA, userB) => {
        const sumScoreA = userA.Scores.reduce((total, score) => total + score.score, 0);
        const sumScoreB = userB.Scores.reduce((total, score) => total + score.score, 0);
        return sumScoreB - sumScoreA;
    });
}

async function getTopFriends(res, req, startDate, endDate) {
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

    res.json(authUser.Friends);
}

module.exports = {
    getTopUsers,
    getTopFriends
}
