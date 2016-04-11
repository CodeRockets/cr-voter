'use strict';

var Boom = require('boom');
var UserModel = require('../models/user');
var FB = require('fb');
var cloudinary = require('cloudinary');


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

        FB.api('me', { fields: ['id', 'name', 'picture.type(large)'], access_token: request.payload.token }, function(res) {

            if (!res || res.error) {
                reply(Boom.badImplementation(JSON.stringify(res)));
                return;
            }

            var data = {};
            data.facebook_id = res.id;
            data.name = res.name;

            cloudinary.uploader.upload(res.picture.data.url, function(result) {

                data.profile_img = result.url;
                self.userModel.upsert(data, function(createdUser) {
                    reply({ data: createdUser });
                });
            });

        });


    } catch (e) {
        reply(Boom.badRequest(e.message));
    }

};



module.exports = UserController;
