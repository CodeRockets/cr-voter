const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Wreck = require('wreck');
var db = require("./db_schemas");

var server = new Hapi.Server({ debug: { request: ['info', 'error'], log: ['info', 'error'] } });



server.connection({
    host: 'localhost',
    port: process.env.PORT || 8000
});

const options = {
    info: {
            'title': 'cr-voter referandum ve kapistir API',
            'version': '1.0',
        }
    };

var plugins = [
    Inert,
    Vision, {
        'register': HapiSwagger,
        'options': options
    }, {
        register: require('./routes/v1/question.js'),
        options: {
            database: db
        }
    }
];




server.ext('onPreResponse', function(request, reply) {

    if (!request.response.isBoom) {
        var source = request.response.source;
        source.statusCode = 200;
        source.error = null;
        source.message = "success";
        source.timestamp = Date.now();
    }
    return reply.continue();
});

//Sync with database
db.sequelize.sync({ logging: true, logging: console.log }).then(function(asdas) {

    //Register the plugins
    server.register(plugins, function(err) {
        if (err) {
            throw err;
        }

        if (!module.parent) {
            server.start(function(err) {
                if (err) {
                    throw err;
                }
                console.log('Server running at: ' + server.info.uri);
                server.log('info', 'Server running at: ' + server.info.uri);
            });
        }
    });

});
