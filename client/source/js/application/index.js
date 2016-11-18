/**
 * Created by ekerot on 2016-10-11.
 */

const ChatApp  = require('./chat/chat');

const Memory = require('./memorygame/memory');

const Draw = require('./drawIt/draw');

module.exports = [
    new ChatApp(),
    new Memory(),
    new Draw()
];



