'use strict';

var crypto = require('crypto');

function UserModel(db) {
    this.userSchema = db.user;
};

UserModel.prototype.upsert = function(user, cb) {
//Upsert olacak
    this.userSchema.create(user).then(function(createdQuestion) {
        cb(createdQuestion);
    });

};



module.exports = UserModel;
