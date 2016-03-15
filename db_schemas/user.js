"use strict";

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV1
        },
        facebook_id: DataTypes.STRING,
        name: DataTypes.STRING,
        profile_img: DataTypes.STRING, // 0: referandum, 1: kapıştır   
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }

    }, {
        tableName: 'user',
        schema: 'public',
        freezeTableName: true,
        timestamps: false,
        hasTrigger: true
    });

    return user;
};