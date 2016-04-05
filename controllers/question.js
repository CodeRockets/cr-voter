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
            "app": request.payload.app
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

        this.questionModel.insertQuestion(newQuestion, function(createdQuestion) {
            reply({ data: createdQuestion });
        });


    } catch (e) {
        reply(Boom.badRequest(e.message));
    }
};


// [GET] /tasks/{id}
QuestionController.prototype.all = function(request, reply) {
    try {

        this.questionModel.showAllQuestions(function(data) {
            reply(data);
        });

    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};
QuestionController.prototype.fetch = function(request, reply) {
    try {

        this.questionModel.fetchQuestions(request.params.app, function(data) {
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

QuestionController.prototype.upload = function(request, reply) {
    try {
        var data = request.payload;
        if (data.file) {
            var name = data.file.hapi.filename;
            var path = __dirname + "/uploads/" + name;
            var file = fs.createWriteStream(path);

            file.on('error', function(err) {
                console.error(err)
            });

            data.file.pipe(file);

            data.file.on('end', function(err) {
                var ret = {
                    filename: data.file.hapi.filename,
                    headers: data.file.hapi.headers
                }
                reply(JSON.stringify(ret));
            })
        }



    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};



module.exports = QuestionController;
