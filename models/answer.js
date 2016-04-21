'use strict';

var crypto = require('crypto');


function AnswerModel(db) {
    this.answerSchema = db.answer;
};

AnswerModel.prototype.answer = function(answer, cb) {


    var self = this;
    var whereQuery = { question_id: answer.question_id, client_id: answer.client_id };

    //eğer user_id varsa user_id yoksa installation_id üzerinden
    if (answer.user_id.length > 0) {
        whereQuery.user_id = answer.user_id;
    } else {
        whereQuery.installation_id = answer.installation_id;
    }


    this.answerSchema.findAll({
        where: whereQuery
    }).then(function(answerList) {

        if (answerList.length == 0) {
            this.answerSchema.create(answer).then(function(createdAnswer) {
                cb(createdAnswer);
            });
        } else {

            var dbAnswer = answerList[0];

            if (dbAnswer.option == 's' && answer.option !== 's') {
                //update et
                dbAnswer.update({
                    option: answer.option
                }).then(function() {
                    cb(dbAnswer);
                });
            } else {
                cb(dbAnswer);
            }
        }

    });
};



module.exports = AnswerModel;
