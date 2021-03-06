'use strict';

var Boom = require('boom');
var QuestionModel = require('../models/question');
var UserModel = require('../models/user');
var cloudinary = require('cloudinary');
var fs = require('fs');
var config_params = require(__dirname + '/../config/config.json');
var async = require('async');


function QuestionController(db) {
    this.questionModel = new QuestionModel(db);
    this.userModel = new UserModel(db);
};

QuestionController.prototype.addQuestion = function (request, reply) {
    try {
        var newQuestion = {
            "user_id": request.payload.user_id,
            "app": request.payload.app
        };

        if (request.payload.app === 1) { //Kapistir
            newQuestion.option_b = request.payload.option_b;
            newQuestion.option_a = request.payload.option_a;
            //empty 

        } else { //Referandum
            newQuestion.question_text = request.payload.question_text;
            newQuestion.question_image = request.payload.question_image;
            newQuestion.option_b = 'hayir';
            newQuestion.option_a = 'evet';
            newQuestion.is_private = request.payload.is_private == null ? false : request.payload.is_private;
            newQuestion.private_url = request.payload.private_url == null ? "" : request.payload.private_url;

        }
        var self = this;
        async.waterfall([
            function (callback) {
                self.questionModel.insertQuestion(newQuestion, function (createdQuestion) {
                    callback(null, createdQuestion);
                });
            },
            function (createdQuestion, callback) {
                if (!request.payload.notify_friend) {
                    callback(null, createdQuestion);
                } else {
                    var friendsArray = [];
                    self.userModel.getUserFriends(newQuestion.user_id, newQuestion.app, function (users) {
                        if (users.length == 0) {
                            callback(null, createdQuestion);
                        }
                        else {
                            for (var i = 0; i < users.length; i++) {
                                var mUser = users[i];
                                if (mUser.reg_id != null || mUser.reg_id != "") {
                                    friendsArray.push(mUser.reg_id);
                                }
                            }
                            self.userModel.findUserById(newQuestion.user_id, function (userinfo) {
                                createdQuestion.asker_name=userinfo.name;
                                self.questionModel.notifyFriends(createdQuestion, friendsArray, function (err, info) {
                                    callback(null, createdQuestion);
                                });
                            });

                        }
                    });
                }
            }
        ], function (err, createdQuestion) {
            reply({ data: createdQuestion });
        });

    } catch (e) {
        reply(Boom.badRequest(e.message));
    }
};

QuestionController.prototype.editQuestion = function (request, reply) {
    try {
        var newQuestion = {
            "id": request.params.id
        };

        if (request.payload.app === 1) { //Kapistir
            newQuestion.option_b = request.payload.option_b;
            newQuestion.option_a = request.payload.option_a;
            //empty 

        } else { //Referandum
            newQuestion.question_text = request.payload.question_text;
            newQuestion.question_image = request.payload.question_image;
            newQuestion.option_b = 'hayir';
            newQuestion.option_a = 'evet';
        }

        this.questionModel.editQuestion(newQuestion, function (editedQuestion) {
            reply({ data: editedQuestion });
        });


    } catch (e) {
        reply(Boom.badRequest(e.message));
    }
};


// [GET] /tasks/{id}
QuestionController.prototype.all = function (request, reply) {
    try {

        this.questionModel.showAllQuestions(function (data) {
            reply(data);
        });

    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

QuestionController.prototype.userQuestions = function (request, reply) {

    this.questionModel.userQuestions(request.params.app, request.query.user_id, request.query.limit, function (data) {
        reply({
            data: {
                "count": data.length,
                "rows": data
            }
        });
    });

};

QuestionController.prototype.fetch = function (request, reply) {
    try {

        var uId = (request.query.user_id || request.query.user_id.length > 0) ? request.query.user_id : null;

        this.questionModel.fetchQuestions(request.params.app, request.query.limit, uId, request.headers['x-voter-installation'], request.query.debug, function (data) {
            reply({
                data: {
                    "count": data.length,
                    "rows": data
                }
            });
        });

    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

QuestionController.prototype.getOne = function (request, reply) {
    try {

        var uId = request.query.user_id;
        var qId = request.params.id;
        var app = request.query.app;

        this.questionModel.getQuestion(uId, qId, app, function (data) {
            reply({
                data: {
                    "rows": data
                }
            });
        });

    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

QuestionController.prototype.delete = function (request, reply) {
    try {

        this.questionModel.deleteQuestion(request.params.id, function (data) {
            reply({
                data: null
            });
        });

    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};




QuestionController.prototype.upload = function (request, reply) {
    try {

        cloudinary.config(config_params["cloudinary"]);

        var data = request.payload;
        var dir = __dirname + "/../uploads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        if (data.file) {
            var name = data.file.hapi.filename;
            var path = __dirname + "/../uploads/" + name;
            var file = fs.createWriteStream(path);

            file.on('error', function (err) {
                console.error(err);
            });

            data.file.pipe(file);

            data.file.on('end', function (err) {

                cloudinary.uploader.upload(path, function (result) {
                    fs.unlink(path, (err) => {
                        if (err) throw err;
                        reply({ data: result.url });
                    });
                });

            });
        } else {
            reply(Boom.notFound("Dosya bulunamadı"));
        }




    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};



module.exports = QuestionController;
