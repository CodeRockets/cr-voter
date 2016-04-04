'use strict';

// Tasks routes
var Joi = require('joi');
var UserController = require('../../controllers/user');


exports.register = function(server, options, next) {
    // Setup the controller
    var userController = new UserController(options.database);

    server.bind(userController);

    // Declare routes
    server.route([{
        method: 'POST',
        path: '/v1/user',
        config: {
            description: 'Creates a user with facebook api token',
            tags: ['api', 'user', 'add'],
            notes: ['Referandum uygulamasından data post ederken **option_a** ve **option_b** parametrelerini göndermenize gerek yok.',
                'Kapıştır uygulamasından data post ederken **question_text** ve **question_image** parametrelerini göndermenize gerek yok.',
                'Success durumunda verilen response hata durumunda statusCode 200 den farklı olarak dünüyor.',
                'İsteğin başarımını response status code dan anlayabilirsiniz. Dönen dataya bakmaya gerek yok.',
                'Headerlar zorunlu.'
            ],
            handler: userController.signup,
            validate: {
                payload: Joi.object().keys({
                    token: Joi.string().required().description('Facebook api token'),
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
                                statusCode: 200,
                                error: null,
                                message: "success",
                                timestamp: Date.now(),
                                data: {
                                    "id": "5d3e2860-d8d0-11e5-9d43-8948e35a3da2",
                                    "option_a_count": 0,
                                    "option_b_count": 0,
                                    "skip_count": 0,
                                    "created_at": "2016-02-21T19:21:53.000Z",
                                    "updated_at": "2016-02-21T19:21:53.000Z",
                                    "is_deleted": false,
                                    "user_id": "user_id",
                                    "app": 0,
                                    "question_text": "Bu pantolon güzel mi?",
                                    "question_image": "http://cdn1.lcwaikiki.com/ProductImages/20152/3/2418450/M_20152-5K8893Z6-2B0_A.jpg",
                                    "option_b": "hayir",
                                    "option_a": "evet"
                                }
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
