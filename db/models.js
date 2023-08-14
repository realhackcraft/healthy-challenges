const fs = require('fs');

const {Sequelize, DataTypes} = require("sequelize");
const {join} = require("path");

const sequelize = new Sequelize({
    host: process.env.AZURE_MYSQL_HOST,
    port: process.env.AZURE_MYSQL_PORT,
    username: process.env.AZURE_MYSQL_USERNAME,
    password: process.env.AZURE_MYSQL_PASSWORD,
    database: process.env.AZURE_MYSQL_DATABASE,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            ca: fs.readFileSync(join(__dirname, '../DigiCertGlobalRootCA.crt.pem')),
        }
    }
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    totalScore: {
        type: DataTypes.VIRTUAL,
    },
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
    } else if (process.argv[2] === "alter") {
        await sequelize.sync({alter: true});
    }
})()

module.exports = {User, Friendship, JWT, Score, sequelize};
