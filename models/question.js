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

QuestionModel.prototype.increaseStats = function(answer, cb) {


    this.questionSchema.increment()

    var incrementField = 'skip_count';

    switch (answer.option) {
        case 'a':
            incrementField = 'option_a_count';
            break;
        case 'b':
            incrementField = 'option_b_count';
            break;
        case 's':
            incrementField = 'skip_count';
            break;
        default:
            incrementField = 'skip_count';
            break;

    }
    this.questionSchema.increment(incrementField).then(function() {
        cb('OK');
    });
    
};


module.exports = QuestionModel;
