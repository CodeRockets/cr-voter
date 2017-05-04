'use strict';

var crypto = require('crypto');

function UserModel(db) {
    this.userSchema = db.user;
    this.sequelize = db.sequelize;
};

UserModel.prototype.upsert = function (user, cb) {
    //Upsert olacak

    var self = this;
    this.userSchema.findAll({
        where: {
            facebook_id: user.facebook_id
        }
    }).then(function (userList) {

        if (userList.length == 0) {
            self.userSchema.create(user).then(function (createdUser) {
                //empty
                cb(createdUser);
            });
        } else {
            var mUser = userList[0];
            mUser.update({
                app: user.app,
                last_fb_token: user.last_fb_token,
                imei: user.imei,
                friends: user.friends,
                reg_id: user.reg_id
            }).then(function () {
                cb(mUser);
            })


        }

    });
};

UserModel.prototype.ban = function (user_id, banned_user_id, app, cb) {
    //Upsert olacak

    var self = this;

    var _replacements = [user_id, banned_user_id, app];

    var rawQuery = 'insert into banned_users(user_id,banned_user_id,app,created_at) VALUES (?,?,?,now())';


    this.sequelize.query(rawQuery, {
        replacements: _replacements
    })
        .then(function () {
            cb();
        });

};

UserModel.prototype.findUserById = function (user_id, cb) {
    //Upsert olacak

    var self = this;
    this.userSchema.findById(user_id).then(function (userinfo) {
        cb(userinfo)
    });


};

UserModel.prototype.getUserFriends = function (user_id, app, cb) {
    //Upsert olacak

    var self = this;


    var rawQuery = 'select * from "user" u where u.facebook_id  in(select unnest(friends) from "user" where id=? and app=?)';


    this.sequelize.query(rawQuery, {
        replacements: [user_id, app],
        type: this.sequelize.QueryTypes.SELECT,
        // model: this.questionSchema
    })
        .then(function (users) {
            cb(users);
        });

};



module.exports = UserModel;
