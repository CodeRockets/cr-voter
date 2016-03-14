'use strict';

var Boom = require('boom');
var AnswerModel = require('../models/answer');


function AnswerController(db) {
    this.answerModel = new AnswerModel(db);
};

AnswerController.prototype.answer = function(request, reply) {
    try {	
     	
    

    } catch (e) {
        reply(Boom.badRequest(e.message));
    }

};



module.exports = AnswerController;
