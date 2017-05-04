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
        imei: DataTypes.STRING, // 0: referandum, 1: kapıştır   
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
        friends: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: null },
        app: DataTypes.INTEGER,
        last_fb_token: DataTypes.STRING,
        reg_id: DataTypes.STRING,


    }, {
        tableName: 'user',
        schema: 'public',
        freezeTableName: true,
        timestamps: false,
        hasTrigger: true
    });

    return user;
};
