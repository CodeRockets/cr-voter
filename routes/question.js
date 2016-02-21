'use strict';

// Tasks routes
var Joi = require('joi');
var QuestionController = require('../controllers/question');


exports.register = function(server, options, next) {
    // Setup the controller
    var questionController = new QuestionController(options.database);

    server.bind(questionController);

    // Declare routes
    server.route([{
            method: 'GET',
            path: '/question/{id}',
            config: {
                handler: questionController.show
            }
        }
        , {
            method: 'POST',
            path: '/question',
            config: {
                handler: questionController.addQuestion,
                validate: {
                    payload: Joi.object().length(2).keys({
                        question: Joi.string().required().min(1).max(60),
                        user_id: Joi.string().required().min(1).max(60)
                    })
                }
            }
        }
    ]);

    next();
}

exports.register.attributes = {
    name: 'routes-question',
    version: '1.0.1'
};
