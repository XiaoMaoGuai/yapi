const mongoose = require('mongoose');
const yapi = require('../yapi.js');
const autoIncrement = require('mongoose-auto-increment');

function model(model, schema) {
    if (schema instanceof mongoose.Schema === false) {
        schema = new mongoose.Schema(schema);
    }

    schema.set('autoIndex', false);

    return yapi.connect.model(model, schema, model);
}

function connect(callback) {
    mongoose.Promise = global.Promise;

    let config = yapi.WEBCONFIG;
    let options = {useMongoClient: true};

    if (config.db.user) {
        options.user = config.db.user;
        options.pass = config.db.pass;
    }
    

    var connectString = `mongodb://${config.db.servername}:${config.db.port}/${config.db.DATABASE}`;
    if (config.db.authSource) {
        connectString = connectString + `?authSource=${config.db.authSource}`;
    }
    
    //yapi.commons.log(connectString);

    let db = mongoose.connect(connectString, options, function (err) {
        if (err) {
            yapi.commons.log(err + ', mongodb Authentication failed', 'error');
        }

    });


    db.then(function () {
        yapi.commons.log('mongodb load success...');
       
        if(typeof callback === 'function'){
            callback.call(db)
        }
    }, function (err) {
        yapi.commons.log(err+'mongodb connect error', 'error');
    });

    autoIncrement.initialize(db);
    return db;
}

yapi.db = model;


module.exports = {
    model: model,
    connect: connect
};