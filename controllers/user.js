'use strict';

var Boom = require('boom');
var UserModel = require('../models/user');
var FB = require('fb');
var cloudinary = require('cloudinary');
var async = require('async');


function UserController(db) {
    this.userModel = new UserModel(db);

};

UserController.prototype.signup = function(request, reply) {
    try {

        cloudinary.config({
            cloud_name: 'dlxdlp9jz',
            api_key: '754935824337155',
            api_secret: '50fqLOOMjIXPNIckPS7znr3lYnI'
        });



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
                    data.imei=request.headers['x-voter-installation'];
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



module.exports = UserController;
