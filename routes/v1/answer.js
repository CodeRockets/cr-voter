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
            notes: ['Eğer cevap verildiği sırada login olunmadıysa user_id boş gönderebilirsiniz', 'text alanına cevabın uzun hali yazılacak, kapistir için link referandum için evet hayir'],
            handler: answerController.answer,
            validate: {
                payload: Joi.object().keys({
                    option: Joi.string().required().description(' soldaki "a" sağdaki "b" skip "s" '),
                    question_id: Joi.string().required().description('question_id'),
                    user_id: Joi.string().required().allow('').description('user_id'),
                    text: Joi.string().required().description('answer text or image link'),
                    client_id: Joi.number().required().description('kapistir için 1 referandum için 0')
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
                                        "id": "f0c236d0-0765-11e6-826e-b336e65223ae",
                                        "created_at": "2016-04-21T02:08:29.000Z",
                                        "updated_at": "2016-04-21T02:08:29.000Z",
                                        "is_deleted": false,
                                        "installation_id": "asdasdasdu88asd",
                                        "option": "a",
                                        "question_id": "89160c90-0676-11e6-9165-7f13b5d750e4",
                                        "user_id": "2d0387a0-0682-11e6-a473-e30ed6cf5986",
                                        "text": "http://res.cloudinary.com/dlxdlp9jz/image/upload/v1461101685/udr8d8sxx0h9myuzzp94.jpg",
                                        "client_id": "1"
                                    },
                                    "statusCode": 200,
                                    "error": null,
                                    "message": "success",
                                    "timestamp": 1461204510133
                                
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
    name: 'routes-answer',
    version: '1.0.1'
};
