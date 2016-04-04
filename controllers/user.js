'use strict';

var Boom = require('boom');
var UserModel = require('../models/user');
var FB = require('fb');


function UserController(db) {
    this.userModel = new UserModel(db);
};

UserController.prototype.signup = function(request, reply) {
    try {

    	var self =this;

        FB.api('me', { fields: ['id', 'name', 'picture.type(large)'], access_token: request.payload.token }, function(res) {

            if (!res || res.error) {
                reply(Boom.badImplementation(res.error));
                return;
            }

            var data = {};
            data.facebook_id=res.id;
            data.name=res.name;
            data.profile_img=res.picture.data.url;


            self.userModel.upsert(data, function(createdQuestion) {
                reply({ data: createdQuestion });
            });


         

        });


    } catch (e) {
        reply(Boom.badRequest(e.message));
    }

};



module.exports = UserController;
