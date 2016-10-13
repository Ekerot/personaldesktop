/**
 * Created by ekerot on 2016-10-11.
 */

const ChatApp  = require('./chat/chat');

const Memory = require('./memory');

module.exports = [
    new ChatApp(),
    new Memory()
];
