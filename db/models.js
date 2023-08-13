const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize({
    host: '127.0.0.1',
    port: 8889,
    username: 'admin',
    password: 'secretpassword',
    database: 'healthy-challenges',
    dialect: 'mysql',
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
});

const Friendship = sequelize.define('Friendship', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',  // This should be the actual table name for the User model
            key: 'id'
        }
    }
});

User.belongsToMany(User, {through: Friendship, as: 'Friends', foreignKey: 'userId'});

const JWT = sequelize.define('JWT', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    refreshToken: DataTypes.STRING,
});

const Score = sequelize.define('Score', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    score: DataTypes.INTEGER,
});

User.hasMany(Score, {foreignKey: 'userId'});
Score.belongsTo(User, {foreignKey: 'userId'});

(async () => {
    if (process.argv[2] === "sync") {
        await sequelize.sync();
    } else if (process.argv[2] === "force") {
        await sequelize.sync({force: true});
        await User.bulkCreate([
            {username: 'user1', password: 'a'},
            {username: 'user2', password: 'a'},
            {username: 'user3', password: 'a'},
            {username: 'user4', password: 'a'},
            {username: 'user5', password: 'a'},]);

        await Friendship.bulkCreate([
            {userId: 1, FriendId: 2},
            {userId: 2, FriendId: 1},
            {userId: 1, FriendId: 3},
            {userId: 1, FriendId: 4},
            {userId: 1, FriendId: 5},]);

        await Score.bulkCreate([
            {userId: 1, score: 2},
            {userId: 1, score: 3},
            {userId: 2, score: 4},
            {userId: 2, score: 5},
            {userId: 3, score: 6},
            {userId: 3, score: 7},
            {userId: 4, score: 8},
            {userId: 4, score: 9},]);

    } else if (process.argv[2] === "alter") {
        await sequelize.sync({alter: true});
    }
})()

module.exports = {User, Friendship, JWT, Score, sequelize};
