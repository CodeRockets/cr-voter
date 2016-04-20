'use strict';

// Tasks routes
var Joi = require('joi');
var AnswerController = require('../../controllers/answer');


exports.register = function(server, options, next) {
    // Setup the controller
    var answerController = new AnswerController(options.database);

    server.bind(answerController);

    // Declare routes
    server.route([{
        method: 'POST',
        path: '/v1/answer',
        config: {
            description: 'Answer route',
            tags: ['api', 'user', 'add'],
            notes: ['Answer','cevaplardan'],
            handler: answerController.answer,
            validate: {
                payload: Joi.object().keys({                    
                    installation_id: Joi.string().required().description('installation_id veya imei'),
                    option:Joi.string().required().description(' soldaki "a" sağdaki "b" skip "s" '),
                    question_id:Joi.string().required().description('question_id'),
                    user_id:Joi.string().required().description('user_id'),
                    text:Joi.string().required().description('answer text or image link'),
                    client_id:Joi.string().required().description('kapistir için 1 referandum için 0')                    
                }),
                headers: Joi.object({
                    'x-voter-client-id': Joi.string().required().description('Her app için farklı olacak.'),
                    'x-voter-version': Joi.string().required().description('Versiyon - Mobil uygulama versiyonu.'),
                    'x-voter-installation': Joi.string().required().description('Her installation için farklı bir id olacak.'),
                }).unknown()
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Response success örneği, aynı object hata durumunda da dönüyor.',
                            'schema': Joi.object({
                                "data": {
                                    "id": "c94642f0-fd0f-11e5-9a28-a3a2789bd42e",
                                    "created_at": "2016-04-07T22:26:34.000Z",
                                    "updated_at": "2016-04-07T22:26:34.000Z",
                                    "is_deleted": false,
                                    "facebook_id": "10153036713185139",
                                    "name": "Eyüp Ferhat Güdücü",
                                    "profile_img": "http://res.cloudinary.com/dlxdlp9jz/image/upload/v1460068234/w9uanjdmtg86xebceoqv.jpg"
                                },
                                "statusCode": 200,
                                "error": null,
                                "message": "success",
                                "timestamp": 1460067996068
                            }).label('Result')
                        }
                    }
                }
            }
        }
    }]);

    next();
}

exports.register.attributes = {
    name: 'routes-user',
    version: '1.0.1'
};
