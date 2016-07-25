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
            notes: ['Sadece facebook auth_token göndereceksiniz. Geriye user alacaksınız.',
                'Headerlar zorunlu.'
            ],
            handler: userController.signup,
            validate: {
                payload: Joi.object().keys({
                    token: Joi.string().required().description('Facebook api token')
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
    }, {
        method: 'GET',
        path: '/v1/user/questions',
        config: {
            description: 'Fetch asked questions of users',
            tags: ['api', 'question', 'user', 'fetch'],
            notes: ['Her istekte limit değeri kadar soru getirir.'],
            handler: userController.fetchUserQuestions,
            validate: {
                params: {
                    app: Joi.number().min(0).max(1).description('App referandum için 0, kapistir için 1'),
                    limit: Joi.number().description('Kaç adet soru getireceği bilgisi, default: 10'),
                    user_id: Joi.string().description('Kaç adet soru getireceği bilgisi, default: 10'),
                },
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
                                    "count": 17,
                                    "rows": 'question array'
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
