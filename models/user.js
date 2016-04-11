'use strict';

var crypto = require('crypto');

function UserModel(db) {
    this.userSchema = db.user;
};

UserModel.prototype.upsert = function(user, cb) {
    //Upsert olacak

var self=this;
    this.userSchema.findAll({
        where: {
            facebook_id: user.facebook_id
        }
    }).then(function(userList) {

        if (userList.length == 0) {
            self.userSchema.create(user).then(function(createdUser) {
                cb(createdUser);
            });
        } else {
            cb(userList[0]);
        }

    });




};



module.exports = UserModel;
