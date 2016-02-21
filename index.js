var Hapi = require('hapi');
var Wreck = require('wreck');
var db = require("./db_schemas");

var server = new Hapi.Server({ debug: { request: ['info', 'error'], log: ['info', 'error'] } });



server.connection({
    host: 'localhost',
    port: 8000
});

var plugins = [{
    register: require('./routes/v1/question.js'),
    options: {
        database: db
    }
}];


server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        reply('Hello, world!');
    }
});


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
