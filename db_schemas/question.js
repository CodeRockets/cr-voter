"use strict";

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var question = sequelize.define("question", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV1
        },
        question: DataTypes.STRING,
        user_id: DataTypes.STRING
    }, {
        tableName: 'question',
        schema: 'public',
        freezeTableName: true,
        timestamps: false,
        hasTrigger: true
    });

    return question;
};
