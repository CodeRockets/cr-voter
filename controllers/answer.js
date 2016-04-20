'use strict';

var Boom = require('boom');
var AnswerModel = require('../models/answer');
var async = require('async');


function AnswerController(db) {
    this.answerModel = new AnswerModel(db);
};

AnswerController.prototype.answer = function(request, reply) {
    try {	


/*
Bu kısımda yapılacaklar: 

1- userId'sini güncelle installation_id'nin
2- answer create
3- question'ın count'unu düzenle


*/
     	
   	// this.answerModel.answer();

    } catch (e) {
        reply(Boom.badRequest(e.message));
    }

};



module.exports = AnswerController;
