'use strict';

var crypto = require('crypto');

function AnswerModel(db) {
    this.answerSchema = db.answer;
};

AnswerModel.prototype.answer = function(answer, cb) {

//question cevaplar atanacak
    this.answerSchema.create(answer).then(function(createdQuestion) {
        cb(createdQuestion);
    });
};



module.exports = AnswerModel;
