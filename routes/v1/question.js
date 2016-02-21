'use strict';

// Tasks routes
var Joi = require('joi');
var QuestionController = require('../../controllers/question');


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
    }, {
        method: 'POST',
        path: '/question',
        config: {
            handler: questionController.addQuestion,
            validate: {
                payload: Joi.object().length(6).keys({
                    question_text: Joi.alternatives().when('app', { is: 0, then: Joi.string().required(), otherwise: Joi.any().optional() }),
                    question_image: Joi.alternatives().when('app', { is: 0, then: Joi.string().required(), otherwise: Joi.any().optional() }),
                    user_id: Joi.string().required(),
                    app: Joi.number().min(0).max(1).required(),
                    option_a: Joi.alternatives().when('app', { is: 1, then: Joi.string().required(), otherwise: Joi.any().optional() }),
                    option_b: Joi.alternatives().when('app', { is: 1, then: Joi.string().required(), otherwise: Joi.any().optional() }),
                }),
                headers: Joi.object({
                    'x-voter-client-id': Joi.string().required(),
                    'x-voter-version': Joi.string().required(),
                    'x-voter-installation': Joi.string().required()
                }).unknown()
            
            }
        }
    }]);

    next();
}

exports.register.attributes = {
    name: 'routes-question',
    version: '1.0.1'
};
