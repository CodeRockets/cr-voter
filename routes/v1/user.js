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
    }]);

    next();
}

exports.register.attributes = {
    name: 'routes-user',
    version: '1.0.1'
};
