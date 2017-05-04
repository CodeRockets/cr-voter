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
        path: '/v1/question/all',
        config: {
            description: '[TEST] Get all questions on db',
            tags: ['api', 'question', 'all', 'test'],
            notes: ['Veritabanındaki tüm soruları getirir.',
                'Test içindir. Productionda kapatılacak.'
            ],
            handler: questionController.all
        }
    }, {
        method: 'GET',
        path: '/v1/question/fetch/{app}',
        config: {
            description: 'Fetch by application type',
            tags: ['api', 'question', 'fetch'],
            notes: ['Her istekte limit değeri kadar soru getirir, eğer login değilse user_id boş bırakılabilir'],
            handler: questionController.fetch,
            validate: {
                params: {
                    app: Joi.number().min(0).max(1).required().description('App referandum için 0, kapistir için 1'),
                    limit: Joi.number().description('Kaç adet soru getireceği bilgisi, default: 10'),
                    user_id: Joi.string().description('Kaç adet soru getireceği bilgisi, default: 10'),
                    debug: Joi.number().min(0).max(1).description('Debug için 1'),
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
    }, {
        method: 'POST',
        path: '/v1/question/delete/{id}',
        config: {
            description: 'Delete question',
            tags: ['api', 'question', 'delete'],
            notes: ['idsi verilen soruyu siler'],
            handler: questionController.delete,
            validate: {

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
                                data: null
                            }).label('Result')
                        }
                    }
                }
            }
        }
    }, {
        method: 'GET',
        path: '/v1/question/get/{id}',
        config: {
            description: 'Get one question',
            tags: ['api', 'question', 'get'],
            notes: ['ÖNEMLİ user_id uuid olmak zorunda!!!!'],
            handler: questionController.getOne,
            validate: {
                query: {
                    'app': Joi.number().min(0).max(1).description('App referandum için 0, kapistir için 1'),
                    'user_id': Joi.string().description('Kaç adet soru getireceği bilgisi, default: 10')
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
                                data: null
                            }).label('Result')
                        }
                    }
                }
            }
        }
    }, {
        method: 'POST',
        path: '/v1/question',
        config: {
            description: 'Add question route for both application',
            tags: ['api', 'question', 'add'],
            notes: ['Referandum uygulamasından data post ederken **option_a** ve **option_b** parametrelerini göndermenize gerek yok.',
                'Kapıştır uygulamasından data post ederken **question_text** ve **question_image** parametrelerini göndermenize gerek yok.',
                'Success durumunda verilen response hata durumunda statusCode 200 den farklı olarak dünüyor.',
                'İsteğin başarımını response status code dan anlayabilirsiniz. Dönen dataya bakmaya gerek yok.',
                'Headerlar zorunlu.'
            ],

            handler: questionController.addQuestion,
            validate: {
                payload: Joi.object().keys({
                    question_text: Joi.when('app', { is: 0, then: Joi.required() }).description('Soru metni'),
                    question_image: Joi.when('app', { is: 0, then: Joi.required() }).description('Soru resim linki'),
                    user_id: Joi.string().required().description('User id'),
                    app: Joi.number().min(0).max(1).required().description('App referandum için 0, kapistir için 1'),
                    option_a: Joi.when('app', { is: 1, then: Joi.required() }).description('A şıkkı metni ya da resim linki'),
                    option_b: Joi.when('app', { is: 1, then: Joi.required() }).description('B şıkkı metni ya da resim linki'),
                    notify_friend: Joi.boolean().description("friend notification"),
                    is_private:Joi.boolean().description("is private"),
                    private_url:Joi.string().description("private url")
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
    }, {
        method: 'POST',
        path: '/v1/question/edit/{id}',
        config: {
            description: 'Edit question route for both application',
            tags: ['api', 'question', 'add'],
            notes: ['Referandum uygulamasından data post ederken **option_a** ve **option_b** parametrelerini göndermenize gerek yok.',
                'Kapıştır uygulamasından data post ederken **question_text** ve **question_image** parametrelerini göndermenize gerek yok.',
                'Success durumunda verilen response hata durumunda statusCode 200 den farklı olarak dünüyor.',
                'İsteğin başarımını response status code dan anlayabilirsiniz. Dönen dataya bakmaya gerek yok.',
                'Headerlar zorunlu.'
            ],

            handler: questionController.editQuestion,
            validate: {
                payload: Joi.object().keys({
                    question_text: Joi.when('app', { is: 0, then: Joi.required() }).description('Soru metni'),
                    question_image: Joi.when('app', { is: 0, then: Joi.required() }).description('Soru resim linki'),
                    option_a: Joi.when('app', { is: 1, then: Joi.required() }).description('A şıkkı metni ya da resim linki'),
                    option_b: Joi.when('app', { is: 1, then: Joi.required() }).description('B şıkkı metni ya da resim linki'),
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
    }, {
        method: 'POST',
        path: '/v1/question/image',
        config: {
            description: 'Upload image',
            tags: ['api', 'image', 'upload'],
            notes: ['image upload ', 'https://github.com/CodeRockets/cr-voter/blob/master/postman-img-upload.png'],
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 209715200,
                timeout: false
            },
            handler: questionController.upload,
            validate: {
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
                                    "img": "http://cdn1.lcwaikiki.com/ProductImages/20152/3/2418450/M_20152-5K8893Z6-2B0_A.jpg"
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
    name: 'routes-question',
    version: '1.0.1'
};
