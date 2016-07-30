'use strict';

var crypto = require('crypto');
var Sequelize = require('sequelize');

function QuestionModel(db) {
    this.questionSchema = db.question;
    this.sequelize = db.sequelize;
};

QuestionModel.prototype.insertQuestion = function(question, cb) {

    this.questionSchema.create(question).then(function(createdQuestion) {
        cb(createdQuestion);
    });
};

QuestionModel.prototype.showAllQuestions = function(cb) {

    this.questionSchema.findAll().then(function(questions) {
        cb(questions);
    });
};

QuestionModel.prototype.userQuestions = function(user_id, app, limit, cb) {

    this.questionSchema.findAll({
        where: {
            user_id: user_id,
            app: app,
            is_deleted: false
        },
        limit: limit
    }).then(function(questions) {
        cb(questions);
    });
};

QuestionModel.prototype.fetchQuestions = function(app, limit, user_id, installation_id, debug, cb) {

    var debugMode = debug ? debug : 0;
    var rawQuery = "";
    if (debugMode == 1) {
        rawQuery = "DROP TABLE IF EXISTS tempUserQuestionTable; " +
            "CREATE TEMP TABLE tempUserQuestionTable AS " +
            "select  * from question where question.app=? and question.is_deleted=FALSE;";

        rawQuery = rawQuery + 'select tu.*,u.profile_img as asker_profile_img, u.name as asker_name from (select (row_number() over ()) as rn,* from tempUserQuestionTable) as tu inner JOIN "user" as u on u.id=tu.user_id where tu.rn in (' +
            "select DISTINCT round(random() * (select count( * ) from tempUserQuestionTable))::integer as id " +
            "from generate_series(1, 100)" +
            ") limit ?;";
        this.sequelize.query(rawQuery, {
                replacements: [app, limit],
                type: this.sequelize.QueryTypes.SELECT,
                // model: this.questionSchema
            })
            .then(function(questions) {
                cb(questions);
            });

    } else {
        rawQuery = "DROP TABLE IF EXISTS tempUserQuestionTable; " +
            "CREATE TEMP TABLE tempUserQuestionTable AS " +
            "select  * from question where question.app=? and question.is_deleted=FALSE " +
            "EXCEPT " +
            "select q.* from answer a inner JOIN question q on a.question_id=q.id ";

        rawQuery = rawQuery + ((user_id) ? "where a.user_id=(?::UUID); " : "where a.installation_id=?; ");

        rawQuery = rawQuery + 'select tu.*,u.profile_img as asker_profile_img,u.name as asker_name from (select (row_number() over ()) as rn,* from tempUserQuestionTable) as tu inner JOIN "user" as u on u.id=tu.user_id where tu.rn in (' +
            "select DISTINCT round(random() * (select count( * ) from tempUserQuestionTable))::integer as id " +
            "from generate_series(1, 100)" +
            ") limit ?;";
        this.sequelize.query(rawQuery, {
                replacements: [app, (user_id) ? user_id : installation_id, limit],
                type: this.sequelize.QueryTypes.SELECT,
                // model: this.questionSchema
            })
            .then(function(questions) {
                cb(questions);
            });
    }

};



QuestionModel.prototype.getAllKapistirForWeb = function(cb) {

   
    var rawQuery = 'select tu.*,u.profile_img as asker_profile_img,u.facebook_id,  u.name as asker_name from question as tu inner JOIN "user" as u on u.id=tu.user_id where tu.app=1 ORDER BY created_at desc';

        this.sequelize.query(rawQuery, {
                //replacements: [app, (user_id) ? user_id : installation_id, limit],
                type: this.sequelize.QueryTypes.SELECT,
                // model: this.questionSchema
            })
            .then(function(questions) {
                cb(questions);
            });
   

};




QuestionModel.prototype.increaseStats = function(answer, cb) {

    var incrementField = { skip_count: Sequelize.literal('skip_count+1') }

    switch (answer.option) {
        case 'a':
            incrementField = { option_a_count: Sequelize.literal('option_a_count+1') };
            break;
        case 'b':
            incrementField = { option_b_count: Sequelize.literal('option_b_count+1') };
            break;
        case 's':
            incrementField = { skip_count: Sequelize.literal('skip_count+1') };
            break;
        default:
            incrementField = { skip_count: Sequelize.literal('skip_count+1') };
            break;
    }

    this.questionSchema.update(incrementField, {
        where: { id: answer.question_id }
    }).then(function() {
        cb('OK');
    });

};


QuestionModel.prototype.increaseAbuse = function(answer, cb) {

    var incrementField = { abuse_count: Sequelize.literal('abuse_count+1') }    

    this.questionSchema.update(incrementField, {
        where: { id: answer.question_id }
    }).then(function() {
        cb('OK');
    });

};

QuestionModel.prototype.increaseFavorite = function(answer, cb) {

    var incrementField = { favorite_count: Sequelize.literal('favorite_count+1') }    

    this.questionSchema.update(incrementField, {
        where: { id: answer.question_id }
    }).then(function() {
        cb('OK');
    });

};


module.exports = QuestionModel;
