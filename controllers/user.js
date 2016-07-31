'use strict';

var Boom = require('boom');
var UserModel = require('../models/user');
var QuestionModel = require('../models/question');
var FB = require('fb');
var cloudinary = require('cloudinary');
var async = require('async');
var config_params = require(__dirname + '/../config/config.json');


function UserController(db) {
    this.userModel = new UserModel(db);
    this.questionModel = new QuestionModel(db);
};

UserController.prototype.signup = function(request, reply) {
    try {

        cloudinary.config(config_params["cloudinary"]);


        var self = this;

        async.waterfall([
            function(callback) {

                FB.api('me', { fields: ['id', 'name', 'picture.type(large)'], access_token: request.payload.token }, function(res) {

                    if (!res || res.error) {
                        callback(res.error, null);
                        return;
                    }

                    var data = {};
                    data.facebook_id = res.id;
                    data.name = res.name;
                    data.profile_img = res.picture.data.url;
                    data.imei = request.headers['x-voter-installation'];
                    callback(null, data);
                });


            },
            function(user_data, callback) {
                cloudinary.uploader.upload(user_data.profile_img, function(result) {
                    user_data.profile_img = result.url;
                    callback(null, user_data);
                });
            },
            function(user_data, callback) {

                self.userModel.upsert(user_data, function(createdUser) {
                    callback(null, createdUser);
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

UserController.prototype.fetchUserQuestions = function(request, reply) {
    try {
var self=this;
        var data = {};
        async.waterfall([
            function(callback) {

                self.questionModel.userQuestions(request.query.user_id,request.query.app,  request.query.limit, function(q) {
                    data.questions = {
                        "count": q.length,
                        "rows": q
                    };
                    callback(null, data);

                });


            },
            function(data, callback) {

                self.questionModel.userFavorites( request.query.user_id,request.query.app, request.query.limit, function(f) {
                    data.favorites = {
                        "count": f.length,
                        "rows": f
                    };
                    callback(null, data);

                });


            }
        ], function(err, result) {
            if (!result || err) {
                reply(Boom.badImplementation(JSON.stringify(err)));
                return;
            } else {
                reply({data:result});
            }
        });

    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};



module.exports = UserController;
