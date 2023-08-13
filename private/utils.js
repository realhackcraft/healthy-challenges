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
            },
            {
                model: Score,
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            }
        ]
    });


    let friendsWithScores = [];

    for (const friend of authUser.Friends) {
        friendsWithScores.push(friend)
    }

    friendsWithScores.push(authUser);

    friendsWithScores.sort((userA, userB) => {
        const sumScoreA = userA.Scores.reduce((total, score) => total + score.score, 0);
        const sumScoreB = userB.Scores.reduce((total, score) => total + score.score, 0);
        return sumScoreB - sumScoreA;
    });

    friendsWithScores.splice(number, authUser.Friends.length - number)

    for (const friend of friendsWithScores) {
        friend.totalScore = friend.Scores.reduce((total, score) => total + score.score, 0);
    }

    return friendsWithScores;
}

module.exports = {
    getTopUsers,
    getTopFriends
}
