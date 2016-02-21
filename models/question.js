'use strict';

var crypto = require('crypto');

function QuestionModel(db) {
    this.questionSchema = db.question;
};

QuestionModel.prototype.insertQuestion = function(question, cb) {

    this.questionSchema.create(question).then(function(createdQuestion) {
        cb(createdQuestion);
    });
};

QuestionModel.prototype.showAllQuestions = function(cb) {

    this.questionSchema.findAll().then(function(questions) {
        cb(questions);
    });
};

QuestionModel.prototype.fetchQuestions = function(app, cb) {

    this.questionSchema.findAndCountAll({
        where: {
            app: app,
            is_deleted: false
        },
        limit: 10
    }).then(function(questions) {
        cb(questions);
    });
};

module.exports = QuestionModel;
