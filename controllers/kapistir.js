'use strict';

var Boom = require('boom');
var QuestionModel = require('../models/question');

function KapistirController(db) {
    this.questionModel = new QuestionModel(db);
};




// [GET] /tasks/{id}
KapistirController.prototype.all = function(request, reply) {
    try {

        this.questionModel.getAllKapistirForWeb(function(data) {

            var results2d = [];
            while(data[0]) {
                 results2d.push(data.splice(0, 2));
            }

            reply.view('kapistirquestions',{data:results2d});        
        });

    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};
KapistirController.prototype.ref = function(request, reply) {
    reply.view('ref',null);     
};



module.exports = KapistirController;
