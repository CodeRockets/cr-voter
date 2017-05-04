'use strict';

// Tasks routes
var Joi = require('joi');
var KapistirController = require('../../controllers/kapistir');


exports.register = function(server, options, next) {
    // Setup the controller
    var kapistirController = new KapistirController(options.database);

    server.bind(kapistirController);

    // Declare routes
    server.route([{
        method: 'GET',
        path: '/v1/kapistir',
        config: {
            handler: kapistirController.all
        }
    }, {
        method: 'GET',
        path: '/v1/ref',
        config: {
            handler: kapistirController.ref
        }
    },{
        method: 'GET',
        path: '/public/{path*}',
        handler: {
            directory: {
                path: './public',
                listing: true,
                index: true
            }
        }

    }]);

    next();
}

exports.register.attributes = {
    name: 'routes-kapistir',
    version: '1.0.1'
};
