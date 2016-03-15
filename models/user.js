'use strict';

var crypto = require('crypto');

function UserModel(db) {
    this.userSchema = db.answer;
};

UserModel.prototype.upsert = function(answer, cb) {



    this.userSchema.create(answer).then(function(createdQuestion) {
        cb(createdQuestion);
    });
};



module.exports = UserModel;
