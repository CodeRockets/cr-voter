"use strict";

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var question = sequelize.define("question", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV1
        },
        question_text: DataTypes.STRING,
        question_image: DataTypes.STRING,
        user_id: Sequelize.UUID,
        app: DataTypes.INTEGER, // 0: referandum, 1: kapıştır
        option_a: DataTypes.STRING,
        option_b: DataTypes.STRING,
        option_a_count: { type: DataTypes.INTEGER, defaultValue: 0 },
        option_b_count: { type: DataTypes.INTEGER, defaultValue: 0 },
        skip_count: { type: DataTypes.INTEGER, defaultValue: 0 },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },

    }, {
        tableName: 'question',
        schema: 'public',
        freezeTableName: true,
        timestamps: false,
        hasTrigger: true
    });

    return question;
};
