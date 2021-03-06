'use strict';

var crypto = require('crypto');


function AnswerModel(db) {
    this.answerSchema = db.answer;
    this.db = db;
};

AnswerModel.prototype.answer = function(answer, cb) {


    var self = this;

    var rawQuery = 'select * from answer where client_id=? and question_id=?::UUID and ';

    if (answer.user_id) {
        rawQuery = rawQuery + 'answer.user_id=?::UUID;'
    } else {
        rawQuery = rawQuery + 'answer.installation_id=?;'
    }

    self.db.sequelize.query(rawQuery, { replacements: [answer.client_id, answer.question_id, answer.user_id ? answer.user_id : answer.installation_id], type: self.db.sequelize.QueryTypes.SELECT, model: self.answerSchema })
        .then(function(answerList) {
            if (answerList.length == 0) {
                self.answerSchema.create(answer).then(function(createdAnswer) {
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
        })

};


AnswerModel.prototype.reportAbuse = function(answer, cb) {


    var self = this;

    var rawQuery = 'select * from answer where client_id=? and question_id=?::UUID and ';

    if (answer.user_id) {
        rawQuery = rawQuery + 'answer.user_id=?::UUID;'
    } else {
        rawQuery = rawQuery + 'answer.installation_id=?;'
    }

    self.db.sequelize.query(rawQuery, { replacements: [answer.client_id, answer.question_id, answer.user_id ? answer.user_id : answer.installation_id], type: self.db.sequelize.QueryTypes.SELECT, model: self.answerSchema })
        .then(function(answerList) {
                if (answerList.length == 0) {
                    answer.is_abuse = true;
                    self.answerSchema.create(answer).then(function(createdAnswer) {
                        cb(createdAnswer);
                    });
                } else {

                    var dbAnswer = answerList[0];


                    dbAnswer.update({
                        is_abuse : true
                    }).then(function() {
                        cb(dbAnswer);
                    });

                }
            });
       

};

AnswerModel.prototype.setFavorite = function(answer, cb) {


    var self = this;

    var rawQuery = 'select * from answer where client_id=? and question_id=?::UUID and ';

    if (answer.user_id) {
        rawQuery = rawQuery + 'answer.user_id=?::UUID;'
    } else {
        rawQuery = rawQuery + 'answer.installation_id=?;'
    }

    self.db.sequelize.query(rawQuery, { replacements: [answer.client_id, answer.question_id, answer.user_id ? answer.user_id : answer.installation_id], type: self.db.sequelize.QueryTypes.SELECT, model: self.answerSchema })
        .then(function(answerList) {
                if (answerList.length == 0) {
                    answer.is_favorite = !answer.unfavorite;
                    self.answerSchema.create(answer).then(function(createdAnswer) {
                        cb(createdAnswer);
                    });
                } else {

                    var dbAnswer = answerList[0];
                    dbAnswer.update({
                        is_favorite : !answer.unfavorite
                    }).then(function() {
                        cb(dbAnswer);
                    });

                }
            
        });

};


module.exports = AnswerModel;
