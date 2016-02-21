'use strict';

var crypto = require('crypto');

function QuestionModel(db) {
    this.questionSchema = db.question;
};

QuestionModel.prototype.insertQuestion = function(question) {

    this.questionSchema.create(question).then(function(createdQuestion) {
        return createdQuestion;
    });
};

module.exports = QuestionModel;
