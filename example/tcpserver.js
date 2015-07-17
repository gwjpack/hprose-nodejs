/*jshint node:true, eqeqeq:true */
'use strict';

var hprose = require('../lib/hprose.js');

function hello(name, context) {
    return 'Hello ' + name + '! -- ' + context.socket.remoteAddress;
}

function hello2(name) {
    return 'Hello ' + name + '!';
}

function asyncHello(name, callback) {
    callback('Hello ' + name + '!');
}

function getMaps() {
    var context = Array.prototype.pop.call(arguments);
    var result = {};
    var key;
    for (key in arguments) {
        result[key] = arguments[key];
    }
    return result;
}

function LogFilter() {
    this.inputFilter = function(value) {
        console.log(hprose.BytesIO.toString(value));
        return value;
    };
    this.outputFilter = function(value) {
        console.log(hprose.BytesIO.toString(value));
        return value;
    };
}

var server = hprose.Server.create("tcp://0.0.0.0:4321");
server.debug = true;
server.filter = new LogFilter();
server.simple = true;
server.passContext = true;
server.addFunctions([hello, hello2, getMaps]);
server.addAsyncFunction(asyncHello);
server.on('sendError', function(message) {
    console.log(message);
});
server.start();
