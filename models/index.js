const { Sequelize } = require("sequelize");
const { sequelize } = require("../db");

const Snippet = sequelize.define("snippet", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    language: Sequelize.STRING,
    code: Sequelize.STRING,
});

const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING,
});

Snippet.belongsTo(User);
User.hasMany(Snippet);

module.exports = {
    db: sequelize,
    Snippet,
    User,
};
