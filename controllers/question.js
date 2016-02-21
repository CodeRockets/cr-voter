'use strict';

var Boom = require('boom');
var QuestionModel = require('../models/question');


function QuestionController(db) {
    this.questionModel = new QuestionModel(db);
};

QuestionController.prototype.addQuestion = function(request, reply) {
    try {
    	var newQuestion={

			"question":request.payload.question,
			"user_id":request.payload.user_id,
    	};
    	this.questionModel.insertQuestion(newQuestion)
        reply("Test")
        
    } catch (e) {
        reply(Boom.badRequest(e.message));
    }
};


// [GET] /tasks/{id}
QuestionController.prototype.show = function(request, reply) {
    try {  

        reply("Yeaaaa");
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

module.exports = QuestionController;