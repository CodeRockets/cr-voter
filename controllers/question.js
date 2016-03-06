'use strict';

var Boom = require('boom');
var QuestionModel = require('../models/question');


function QuestionController(db) {
    this.questionModel = new QuestionModel(db);
};

QuestionController.prototype.addQuestion = function(request, reply) {
    try {
        var newQuestion = {
            "user_id": request.payload.user_id,
            "app" : request.payload.app
        };

        if (request.payload.app === 1) { //Kapistir
            newQuestion.option_b = request.payload.option_b;
            newQuestion.option_a = request.payload.option_a;

        } else { //Referandum
            newQuestion.question_text = request.payload.question_text;
            newQuestion.question_image = request.payload.question_image;
            newQuestion.option_b = 'hayir';
            newQuestion.option_a = 'evet';
        }

        this.questionModel.insertQuestion(newQuestion,function(createdQuestion){
            reply({data:createdQuestion});
        });
    

    } catch (e) {
        reply(Boom.badRequest(e.message));
    }

};


// [GET] /tasks/{id}
QuestionController.prototype.all = function(request, reply) {
    try {
        
        this.questionModel.showAllQuestions(function(data){
            reply(data);
        });
       
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};
QuestionController.prototype.fetch = function(request, reply) {
    try {
        
        this.questionModel.fetchQuestions(request.params.app,function(data){
            reply(data);
        });
       
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

QuestionController.prototype.answer = function(request, reply) {
    try {
        
       
       
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};



module.exports = QuestionController;
