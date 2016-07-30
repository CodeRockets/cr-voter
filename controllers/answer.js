'use strict';

var Boom = require('boom');
var AnswerModel = require('../models/answer');
var QuestionModel = require('../models/question');
var async = require('async');


function AnswerController(db) {
    this.answerModel = new AnswerModel(db);
    this.questionModel = new QuestionModel(db);
};

AnswerController.prototype.answer = function(request, reply) {
    try {

        var self = this;

        async.waterfall([
            function(callback) {

                var newAnswer = {};
                newAnswer.installation_id = request.headers['x-voter-installation'];
                newAnswer.option = request.payload.option;
                newAnswer.question_id = request.payload.question_id;
                newAnswer.user_id = request.payload.user_id;
                newAnswer.text = request.payload.text;
                newAnswer.client_id = request.payload.client_id.toString();

                if(!request.payload.user_id||request.payload.user_id.length==0){
                    delete newAnswer.user_id;
                }
                
                self.answerModel.answer(newAnswer, function(answered) {
                	callback(null,answered);

                });

            },
            function(answer, callback) {
               self.questionModel.increaseStats(answer, function(answered) {
                	callback(null,answer);

                });
            }
        ], function(err, result) {
            if (!result || err) {
                reply(Boom.badImplementation(JSON.stringify(err)));
                return;
            } else {
                reply({ data: result });
            }
        });

    } catch (e) {
        reply(Boom.badRequest(e.message));
    }

};

AnswerController.prototype.reportAbuse = function(request, reply) {
    try {

        var self = this;

        async.waterfall([
            function(callback) {

                var newAnswer = {};
                newAnswer.installation_id = request.headers['x-voter-installation'];
                newAnswer.option = 's';
                newAnswer.question_id = request.payload.question_id;
                newAnswer.user_id = request.payload.user_id;
                newAnswer.text = '';
                newAnswer.client_id = request.payload.client_id.toString();

                if(!request.payload.user_id||request.payload.user_id.length==0){
                    delete newAnswer.user_id;
                }
                
                self.answerModel.reportAbuse(newAnswer, function(answered) {
                    callback(null,answered);

                });

            },
            function(answer, callback) {
               self.questionModel.increaseAbuse(answer, function(answered) {
                    callback(null,answer);

                });
            }
        ], function(err, result) {
            if (!result || err) {
                reply(Boom.badImplementation(JSON.stringify(err)));
                return;
            } else {
                reply({ data: result });
            }
        });

    } catch (e) {
        reply(Boom.badRequest(e.message));
    }

};

AnswerController.prototype.setFavorite = function(request, reply) {
    try {

        var self = this;

        async.waterfall([
            function(callback) {

                var newAnswer = {};
                newAnswer.installation_id = request.headers['x-voter-installation'];
                newAnswer.option = 's';
                newAnswer.question_id = request.payload.question_id;
                newAnswer.user_id = request.payload.user_id;
                newAnswer.text = '';
                newAnswer.client_id = request.payload.client_id.toString();

                if(!request.payload.user_id||request.payload.user_id.length==0){
                    delete newAnswer.user_id;
                }
                
                self.answerModel.setFavorite(newAnswer, function(answered) {
                    callback(null,answered);

                });

            },
            function(answer, callback) {
               self.questionModel.increaseAbuse(answer, function(answered) {
                    callback(null,answer);

                });
            }
        ], function(err, result) {
            if (!result || err) {
                reply(Boom.badImplementation(JSON.stringify(err)));
                return;
            } else {
                reply({ data: result });
            }
        });

    } catch (e) {
        reply(Boom.badRequest(e.message));
    }

};




module.exports = AnswerController;
