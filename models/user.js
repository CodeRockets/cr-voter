'use strict';

var crypto = require('crypto');

function UserModel(db) {
    this.userSchema = db.user;
};

UserModel.prototype.upsert = function(user, cb) {
    //Upsert olacak

    var self = this;
    this.userSchema.findAll({
        where: {
            facebook_id: user.facebook_id
        }
    }).then(function(userList) {

        if (userList.length == 0) {
            self.userSchema.create(user).then(function(createdUser) {
                //empty
                cb(createdUser);
            });
        } else {
            var mUser = userList[0];
            mUser.update({
                app:user.app,
                last_fb_token:user.last_fb_token,
                imei: user.imei,
                friends:user.friends
            }).then(function() {
                cb(mUser);
            })


        }

    });
};



module.exports = UserModel;
