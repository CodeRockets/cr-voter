"use strict";

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var question = sequelize.define("answer", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV1
        },
        question_id: Sequelize.UUID,
        user_id: Sequelize.UUID,
        text: DataTypes.STRING, 
        option: DataTypes.STRING,
        installation_id: DataTypes.STRING,
        client_id: DataTypes.STRING,      
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }

    }, {
        tableName: 'answer',
        schema: 'public',
        freezeTableName: true,
        timestamps: false,
        hasTrigger: true
    });

    return question;
};
