(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let clock = require('./modules/clock');
const ApplicationManager = require('./modules/applicationManager')

let applicaitonManager = new ApplicationManager();

clock.clock();
appendIcon();

function appendIcon(){
    let fragment = document.createDocumentFragment();
    let ul = document.querySelector('.nav-list')

    applicaitonManager.getApplicationData().forEach(appData =>{

        let list = document.createElement('li');
        let a = document.createElement('a');
        let imgTag = document.createElement('img');
        imgTag.setAttribute('src', '/image/' + appData.name + ".png");
        imgTag.setAttribute('class', appData.name);
        imgTag.appendChild(a);
        list.appendChild(imgTag);
        fragment.appendChild(list);

    });
    ul.appendChild(fragment);
}




},{"./modules/applicationManager":7,"./modules/clock":8}],2:[function(require,module,exports){
"use strict";

/**
 * Created by ekerot on 2016-10-11.
 */

class ChatApp {

    // constructor(){
    //    this.client = new SocketClien
    // }

    getName() {
        return 'chat';
    }

    /*    onCreate(){
     this.client.connect();
     const htmlElement = view.initialRender();
     return htmlElement;
     }

     //onReady()
     //connect

     render(){
     return view.getInitialRender();
     }

     //onClose()
     //this.client.*/
}

module.exports = ChatApp;


},{}],3:[function(require,module,exports){
'use strict';

/**
 * Created by ekerot on 2016-10-20.
 */


class ChatApp {

    getName() {
        return 'chat';
    }

}

module.exports = ChatApp;

module.exports = function(index) {

    let tal = index;

    let socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/", "charcords");

    document.getElementById('application').setAttribute('id', 'application' + index);
    let container = document.querySelector('#application'+ index);
    let template = document.querySelectorAll('#chat-container')[0].content;
    let textArea = document.importNode(template, true);
    let username;
    let text = '';

    onCreate(tal)

    function onCreate(tal){
        document.getElementById(tal).appendChild(container)
        container.appendChild(textArea);
        if(!username){setUsername();}
    }

    function setUsername(){
        let usernameBox = document.querySelector('.username');
        usernameBox.addEventListener('keydown', userKey);

        function userKey(e) {

            if(e.keyCode == 13) {
                let username = document.querySelector('.username').value;
                usernameBox.value = '';
                onReady(username);
            }

        }

    }

    function onReady(username) {

        text = {
            "type": "message",
            "data": '',
            "username": username,
            "channel": "my, not so secret, channel",
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        };

        socket.addEventListener("open", function () {
            socket.send(JSON.stringify(text));
        });

        reciveText(tal);
        onClose();

        sender.addEventListener('keydown', pressKey );
        function pressKey(e){
            if (e.keyCode == 13) {
                sendText(username);
            }
        }

    }

    let sender = document.getElementById('send');

    function sendText(username) {


        text = {
            "type": "message",
            "data": sender.value,
            "username": username,
            "channel": "my, not so secret, channel",
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        };


        socket.send(JSON.stringify(text));
        sender.value = '';

    }

    function reciveText() {
        socket.onmessage = function (e) {

            let recive = document.querySelector('#recive');
            let message = JSON.parse(e.data)
            let today = new Date();
            let hour = today.getHours();
            let minutes = today.getMinutes();

            if (message.username === 'The Server') {
                return;
            }

            else {
                recive.textContent += '(' + hour + ':' + minutes + ') ' + message.username + ': ' + message.data + '\n';
            }
        }
    }

    function onClose(){

    }
}

},{}],4:[function(require,module,exports){
/**
 * Created by ekerot on 2016-10-11.
 */

const ChatApp  = require('./chat/chat');

const Memory = require('./memorygame/memory');

module.exports = [
    new ChatApp(),
    new Memory()
];




},{"./chat/chat":2,"./memorygame/memory":5}],5:[function(require,module,exports){
"use strict";

/**
 * Created by ekerot on 2016-10-11.
 */

class Memory {

    getName() {
        return 'memory';
    }
}
module.exports = Memory;



},{}],6:[function(require,module,exports){
/**
 * Created by ekerot on 2016-10-19.
 */

module.exports = function(rows, columns, index) {
    let i;
    let a;
    let tiles = [];
    let turn1;
    let turn2;
    let lastTile;
    let tries = 0;
    let pairs = 0;

    tiles = getPicture(rows,columns)

    document.getElementById('application').setAttribute('id', 'application' + index);
    let container = document.querySelector('#application'+ index);
    let template = document.querySelectorAll('#memory-container')[0].content.firstElementChild;

    tiles.forEach(function(tile, index) {

        a = document.importNode(template, true);

        container.appendChild(a);

        a.addEventListener('click', function (event) {

            let img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild;

            turnTile(tile,index,img)
        });

        if ((i + 1) % columns === 0) {
            container.appendChild(document.createElement('br'));
        }
    });

    function turnTile(tile,index, element){

        if(turn2){
            return;
        }
            element.src="image/memoryimages/"+tile+".png";

        if (!turn1){
            turn1 = element;
            lastTile = tile;
            return;
        }

        else{
            turn2 = element;
            tries += 1;

            if(element === turn1){
                return;
            }

            if(lastTile === tile){
                turn1.parentNode.classList.add('removed');
                turn2.parentNode.classList.add('removed');
                pairs += 1;
                turn1 = null;
                turn2 = null;
                if(pairs === (columns*rows)/2){
                    console.log('You won at ' + tries + ' tries!');
                    container.textContent = 'You won at ' + tries + ' tries!';
                }

                return;
            }

            else{
                window.setTimeout(function(){
                    turn1.src = '/image/memoryimages/0.png'
                    turn2.src = '/image/memoryimages/0.png'
                    turn1 = null;
                    turn2 = null;
                }, 200)
            }

        }
    }

    function getPicture(rows, columns){

        let arr = [];
        let i;

        for (i=1; i <= (rows*columns)/2; i++) {
            arr.push(i);
            arr.push(i);

        }

        for (let  i = arr.length-1; i > 0; i--){

            let j = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        return arr;

    }

}

},{}],7:[function(require,module,exports){


/**
 * Created by ekerot on 2016-10-11.
 */
const applications = require('../application/index');
const memoryGame = require('../application/memorygame/memoryGame');
const chat = require('../application/chat/chatApp');
let nodes = [];
let index = 0;
let startPositionTop = 100;
let startPositionLeft = 200;

class ApplicationManager {
    getApplicationData() {
        return applications.map(app => {
            return {name: app.getName()}
        });
    }
}

let template = document.getElementById('template'),
    element;

window.onload = function beforeCreate() {
    element = document.importNode(template.content, true);
    let imgTag = document.querySelectorAll('li > img');
    Array.prototype.forEach.call(imgTag, function (node) {
        node.addEventListener('click', function () {

            nodes.push({
                name: imgTag.src - '.png',
                startPositionTop: startPositionTop,
                startPositionLeft: startPositionLeft,
                index: index
            });

            createWindow();

        });
    });
};

function createWindow(){
    let clonedNode = element.cloneNode(true);
    let div = clonedNode.firstElementChild.setAttribute('id', index.toString());

    document.body.appendChild(clonedNode);

    if(event.target.classList.contains('memory')) {
        new memoryGame(4,4,index);
    }


    if(event.target.classList.contains('chat')){
        new chat(index);
    }

    startPositionTop -= 10;
    startPositionLeft -= 20;
    index++;
    windowConfigures();
}

function windowConfigures() {

    window.onload = addListeners();
    var offX;
    var offY;

    function addListeners(){

        document.body.addEventListener('mousedown', mouseDown, false);
        document.body.addEventListener('click', highLightwindow, false);
        window.addEventListener('mouseup', mouseUp, false);

    }

    function highLightwindow(e) {

        let div =  document.getElementById(e.target.id.toString());
        div.style.zIndex = '9999999'

    }

    function mouseUp()
    {
        window.removeEventListener('mousemove', divMove, true);
    }

    function mouseDown(e){

        let div = '';

        nodes.forEach(function(node){
        if(e.target.id.toString() === node.index.toString()) {
            div =  document.getElementById(e.target.id.toString());
            div.style.zIndex = '9999999'
        }

        else{
            return;
        }

        });

        offY= e.clientY-parseInt(div.offsetTop);
        offX= e.clientX-parseInt(div.offsetLeft);
        window.addEventListener('mousemove', divMove, true);
    }

    function divMove(e){
        let div = document.getElementById(e.target.id.toString());
        div.style.position = 'absolute';
        div.style.top = (e.clientY-offY) + 'px';
        div.style.left = (e.clientX-offX) + 'px';
    }

    function closeWindow(e){
        let windowbutton = document.querySelector('.btn');
        console.log(e.target)
        let div = document.getElementById(e.target.id.toString())
        startPositionLeft += 10;
        startPositionTop += 10

    }
}

module.exports = ApplicationManager;

},{"../application/chat/chatApp":3,"../application/index":4,"../application/memorygame/memoryGame":6}],8:[function(require,module,exports){
"use strict";

/**
 * Created by ekerot on 2016-10-11.
 */

function time() {
    let today = new Date();
    let hour = today.getHours();
    let minutes = today.getMinutes();

    minutes = checkTime(minutes);
    document.querySelector(".time").innerHTML = hour + ':' + minutes;
    setTimeout(time, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = '0' + i
    };
    return i;
}

module.exports.clock = time;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuNy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBsaWNhdGlvbi9jaGF0L2NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcGxpY2F0aW9uL2NoYXQvY2hhdEFwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwbGljYXRpb24vaW5kZXguanMiLCJjbGllbnQvc291cmNlL2pzL2FwcGxpY2F0aW9uL21lbW9yeWdhbWUvbWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBsaWNhdGlvbi9tZW1vcnlnYW1lL21lbW9yeUdhbWUuanMiLCJjbGllbnQvc291cmNlL2pzL21vZHVsZXMvYXBwbGljYXRpb25NYW5hZ2VyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb2R1bGVzL2Nsb2NrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCBjbG9jayA9IHJlcXVpcmUoJy4vbW9kdWxlcy9jbG9jaycpO1xuY29uc3QgQXBwbGljYXRpb25NYW5hZ2VyID0gcmVxdWlyZSgnLi9tb2R1bGVzL2FwcGxpY2F0aW9uTWFuYWdlcicpXG5cbmxldCBhcHBsaWNhaXRvbk1hbmFnZXIgPSBuZXcgQXBwbGljYXRpb25NYW5hZ2VyKCk7XG5cbmNsb2NrLmNsb2NrKCk7XG5hcHBlbmRJY29uKCk7XG5cbmZ1bmN0aW9uIGFwcGVuZEljb24oKXtcbiAgICBsZXQgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgbGV0IHVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1saXN0JylcblxuICAgIGFwcGxpY2FpdG9uTWFuYWdlci5nZXRBcHBsaWNhdGlvbkRhdGEoKS5mb3JFYWNoKGFwcERhdGEgPT57XG5cbiAgICAgICAgbGV0IGxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBsZXQgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbGV0IGltZ1RhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBpbWdUYWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlLycgKyBhcHBEYXRhLm5hbWUgKyBcIi5wbmdcIik7XG4gICAgICAgIGltZ1RhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYXBwRGF0YS5uYW1lKTtcbiAgICAgICAgaW1nVGFnLmFwcGVuZENoaWxkKGEpO1xuICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGltZ1RhZyk7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGxpc3QpO1xuXG4gICAgfSk7XG4gICAgdWwuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xufVxuXG5cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ3JlYXRlZCBieSBla2Vyb3Qgb24gMjAxNi0xMC0xMS5cbiAqL1xuXG5jbGFzcyBDaGF0QXBwIHtcblxuICAgIC8vIGNvbnN0cnVjdG9yKCl7XG4gICAgLy8gICAgdGhpcy5jbGllbnQgPSBuZXcgU29ja2V0Q2xpZW5cbiAgICAvLyB9XG5cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gJ2NoYXQnO1xuICAgIH1cblxuICAgIC8qICAgIG9uQ3JlYXRlKCl7XG4gICAgIHRoaXMuY2xpZW50LmNvbm5lY3QoKTtcbiAgICAgY29uc3QgaHRtbEVsZW1lbnQgPSB2aWV3LmluaXRpYWxSZW5kZXIoKTtcbiAgICAgcmV0dXJuIGh0bWxFbGVtZW50O1xuICAgICB9XG5cbiAgICAgLy9vblJlYWR5KClcbiAgICAgLy9jb25uZWN0XG5cbiAgICAgcmVuZGVyKCl7XG4gICAgIHJldHVybiB2aWV3LmdldEluaXRpYWxSZW5kZXIoKTtcbiAgICAgfVxuXG4gICAgIC8vb25DbG9zZSgpXG4gICAgIC8vdGhpcy5jbGllbnQuKi9cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0QXBwO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlZCBieSBla2Vyb3Qgb24gMjAxNi0xMC0yMC5cbiAqL1xuXG5cbmNsYXNzIENoYXRBcHAge1xuXG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdjaGF0JztcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0QXBwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICBsZXQgdGFsID0gaW5kZXg7XG5cbiAgICBsZXQgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIsIFwiY2hhcmNvcmRzXCIpO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcGxpY2F0aW9uJykuc2V0QXR0cmlidXRlKCdpZCcsICdhcHBsaWNhdGlvbicgKyBpbmRleCk7XG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHBsaWNhdGlvbicrIGluZGV4KTtcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjY2hhdC1jb250YWluZXInKVswXS5jb250ZW50O1xuICAgIGxldCB0ZXh0QXJlYSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuICAgIGxldCB1c2VybmFtZTtcbiAgICBsZXQgdGV4dCA9ICcnO1xuXG4gICAgb25DcmVhdGUodGFsKVxuXG4gICAgZnVuY3Rpb24gb25DcmVhdGUodGFsKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFsKS5hcHBlbmRDaGlsZChjb250YWluZXIpXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZXh0QXJlYSk7XG4gICAgICAgIGlmKCF1c2VybmFtZSl7c2V0VXNlcm5hbWUoKTt9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VXNlcm5hbWUoKXtcbiAgICAgICAgbGV0IHVzZXJuYW1lQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJuYW1lJyk7XG4gICAgICAgIHVzZXJuYW1lQm94LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB1c2VyS2V5KTtcblxuICAgICAgICBmdW5jdGlvbiB1c2VyS2V5KGUpIHtcblxuICAgICAgICAgICAgaWYoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJuYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJuYW1lJykudmFsdWU7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWVCb3gudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICBvblJlYWR5KHVzZXJuYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblJlYWR5KHVzZXJuYW1lKSB7XG5cbiAgICAgICAgdGV4dCA9IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgIFwiZGF0YVwiOiAnJyxcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogdXNlcm5hbWUsXG4gICAgICAgICAgICBcImNoYW5uZWxcIjogXCJteSwgbm90IHNvIHNlY3JldCwgY2hhbm5lbFwiLFxuICAgICAgICAgICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiXG4gICAgICAgIH07XG5cbiAgICAgICAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHRleHQpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVjaXZlVGV4dCh0YWwpO1xuICAgICAgICBvbkNsb3NlKCk7XG5cbiAgICAgICAgc2VuZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBwcmVzc0tleSApO1xuICAgICAgICBmdW5jdGlvbiBwcmVzc0tleShlKXtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICBzZW5kVGV4dCh1c2VybmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGxldCBzZW5kZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VuZCcpO1xuXG4gICAgZnVuY3Rpb24gc2VuZFRleHQodXNlcm5hbWUpIHtcblxuXG4gICAgICAgIHRleHQgPSB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICBcImRhdGFcIjogc2VuZGVyLnZhbHVlLFxuICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSxcbiAgICAgICAgICAgIFwiY2hhbm5lbFwiOiBcIm15LCBub3Qgc28gc2VjcmV0LCBjaGFubmVsXCIsXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHRleHQpKTtcbiAgICAgICAgc2VuZGVyLnZhbHVlID0gJyc7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWNpdmVUZXh0KCkge1xuICAgICAgICBzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgbGV0IHJlY2l2ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZWNpdmUnKTtcbiAgICAgICAgICAgIGxldCBtZXNzYWdlID0gSlNPTi5wYXJzZShlLmRhdGEpXG4gICAgICAgICAgICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgbGV0IGhvdXIgPSB0b2RheS5nZXRIb3VycygpO1xuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSB0b2RheS5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgICAgIGlmIChtZXNzYWdlLnVzZXJuYW1lID09PSAnVGhlIFNlcnZlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlY2l2ZS50ZXh0Q29udGVudCArPSAnKCcgKyBob3VyICsgJzonICsgbWludXRlcyArICcpICcgKyBtZXNzYWdlLnVzZXJuYW1lICsgJzogJyArIG1lc3NhZ2UuZGF0YSArICdcXG4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25DbG9zZSgpe1xuXG4gICAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTExLlxuICovXG5cbmNvbnN0IENoYXRBcHAgID0gcmVxdWlyZSgnLi9jaGF0L2NoYXQnKTtcblxuY29uc3QgTWVtb3J5ID0gcmVxdWlyZSgnLi9tZW1vcnlnYW1lL21lbW9yeScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgICBuZXcgQ2hhdEFwcCgpLFxuICAgIG5ldyBNZW1vcnkoKVxuXTtcblxuXG5cbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMTEuXG4gKi9cblxuY2xhc3MgTWVtb3J5IHtcblxuICAgIGdldE5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnbWVtb3J5JztcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcblxuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMTkuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyb3dzLCBjb2x1bW5zLCBpbmRleCkge1xuICAgIGxldCBpO1xuICAgIGxldCBhO1xuICAgIGxldCB0aWxlcyA9IFtdO1xuICAgIGxldCB0dXJuMTtcbiAgICBsZXQgdHVybjI7XG4gICAgbGV0IGxhc3RUaWxlO1xuICAgIGxldCB0cmllcyA9IDA7XG4gICAgbGV0IHBhaXJzID0gMDtcblxuICAgIHRpbGVzID0gZ2V0UGljdHVyZShyb3dzLGNvbHVtbnMpXG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwbGljYXRpb24nKS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2FwcGxpY2F0aW9uJyArIGluZGV4KTtcbiAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FwcGxpY2F0aW9uJysgaW5kZXgpO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNtZW1vcnktY29udGFpbmVyJylbMF0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgIHRpbGVzLmZvckVhY2goZnVuY3Rpb24odGlsZSwgaW5kZXgpIHtcblxuICAgICAgICBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG5cbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xuXG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgbGV0IGltZyA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lNRycgPyBldmVudC50YXJnZXQgOiBldmVudC50YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICAgICAgICAgIHR1cm5UaWxlKHRpbGUsaW5kZXgsaW1nKVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoKGkgKyAxKSAlIGNvbHVtbnMgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gdHVyblRpbGUodGlsZSxpbmRleCwgZWxlbWVudCl7XG5cbiAgICAgICAgaWYodHVybjIpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50LnNyYz1cImltYWdlL21lbW9yeWltYWdlcy9cIit0aWxlK1wiLnBuZ1wiO1xuXG4gICAgICAgIGlmICghdHVybjEpe1xuICAgICAgICAgICAgdHVybjEgPSBlbGVtZW50O1xuICAgICAgICAgICAgbGFzdFRpbGUgPSB0aWxlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHR1cm4yID0gZWxlbWVudDtcbiAgICAgICAgICAgIHRyaWVzICs9IDE7XG5cbiAgICAgICAgICAgIGlmKGVsZW1lbnQgPT09IHR1cm4xKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxhc3RUaWxlID09PSB0aWxlKXtcbiAgICAgICAgICAgICAgICB0dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3JlbW92ZWQnKTtcbiAgICAgICAgICAgICAgICB0dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3JlbW92ZWQnKTtcbiAgICAgICAgICAgICAgICBwYWlycyArPSAxO1xuICAgICAgICAgICAgICAgIHR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYocGFpcnMgPT09IChjb2x1bW5zKnJvd3MpLzIpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWW91IHdvbiBhdCAnICsgdHJpZXMgKyAnIHRyaWVzIScpO1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIudGV4dENvbnRlbnQgPSAnWW91IHdvbiBhdCAnICsgdHJpZXMgKyAnIHRyaWVzISc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHR1cm4xLnNyYyA9ICcvaW1hZ2UvbWVtb3J5aW1hZ2VzLzAucG5nJ1xuICAgICAgICAgICAgICAgICAgICB0dXJuMi5zcmMgPSAnL2ltYWdlL21lbW9yeWltYWdlcy8wLnBuZydcbiAgICAgICAgICAgICAgICAgICAgdHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSwgMjAwKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQaWN0dXJlKHJvd3MsIGNvbHVtbnMpe1xuXG4gICAgICAgIGxldCBhcnIgPSBbXTtcbiAgICAgICAgbGV0IGk7XG5cbiAgICAgICAgZm9yIChpPTE7IGkgPD0gKHJvd3MqY29sdW1ucykvMjsgaSsrKSB7XG4gICAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCAgaSA9IGFyci5sZW5ndGgtMTsgaSA+IDA7IGktLSl7XG5cbiAgICAgICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgICAgICBsZXQgdGVtcCA9IGFycltpXTtcbiAgICAgICAgICAgIGFycltpXSA9IGFycltqXTtcbiAgICAgICAgICAgIGFycltqXSA9IHRlbXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyO1xuXG4gICAgfVxuXG59XG4iLCJcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTExLlxuICovXG5jb25zdCBhcHBsaWNhdGlvbnMgPSByZXF1aXJlKCcuLi9hcHBsaWNhdGlvbi9pbmRleCcpO1xuY29uc3QgbWVtb3J5R2FtZSA9IHJlcXVpcmUoJy4uL2FwcGxpY2F0aW9uL21lbW9yeWdhbWUvbWVtb3J5R2FtZScpO1xuY29uc3QgY2hhdCA9IHJlcXVpcmUoJy4uL2FwcGxpY2F0aW9uL2NoYXQvY2hhdEFwcCcpO1xubGV0IG5vZGVzID0gW107XG5sZXQgaW5kZXggPSAwO1xubGV0IHN0YXJ0UG9zaXRpb25Ub3AgPSAxMDA7XG5sZXQgc3RhcnRQb3NpdGlvbkxlZnQgPSAyMDA7XG5cbmNsYXNzIEFwcGxpY2F0aW9uTWFuYWdlciB7XG4gICAgZ2V0QXBwbGljYXRpb25EYXRhKCkge1xuICAgICAgICByZXR1cm4gYXBwbGljYXRpb25zLm1hcChhcHAgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtuYW1lOiBhcHAuZ2V0TmFtZSgpfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZW1wbGF0ZScpLFxuICAgIGVsZW1lbnQ7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiBiZWZvcmVDcmVhdGUoKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgbGV0IGltZ1RhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpID4gaW1nJyk7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChpbWdUYWcsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6IGltZ1RhZy5zcmMgLSAnLnBuZycsXG4gICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvblRvcDogc3RhcnRQb3NpdGlvblRvcCxcbiAgICAgICAgICAgICAgICBzdGFydFBvc2l0aW9uTGVmdDogc3RhcnRQb3NpdGlvbkxlZnQsXG4gICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY3JlYXRlV2luZG93KCk7XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKXtcbiAgICBsZXQgY2xvbmVkTm9kZSA9IGVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgIGxldCBkaXYgPSBjbG9uZWROb2RlLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZSgnaWQnLCBpbmRleC50b1N0cmluZygpKTtcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2xvbmVkTm9kZSk7XG5cbiAgICBpZihldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtZW1vcnknKSkge1xuICAgICAgICBuZXcgbWVtb3J5R2FtZSg0LDQsaW5kZXgpO1xuICAgIH1cblxuXG4gICAgaWYoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2hhdCcpKXtcbiAgICAgICAgbmV3IGNoYXQoaW5kZXgpO1xuICAgIH1cblxuICAgIHN0YXJ0UG9zaXRpb25Ub3AgLT0gMTA7XG4gICAgc3RhcnRQb3NpdGlvbkxlZnQgLT0gMjA7XG4gICAgaW5kZXgrKztcbiAgICB3aW5kb3dDb25maWd1cmVzKCk7XG59XG5cbmZ1bmN0aW9uIHdpbmRvd0NvbmZpZ3VyZXMoKSB7XG5cbiAgICB3aW5kb3cub25sb2FkID0gYWRkTGlzdGVuZXJzKCk7XG4gICAgdmFyIG9mZlg7XG4gICAgdmFyIG9mZlk7XG5cbiAgICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKXtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlRG93biwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGlnaExpZ2h0d2luZG93LCBmYWxzZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcCwgZmFsc2UpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlnaExpZ2h0d2luZG93KGUpIHtcblxuICAgICAgICBsZXQgZGl2ID0gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGUudGFyZ2V0LmlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBkaXYuc3R5bGUuekluZGV4ID0gJzk5OTk5OTknXG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3VzZVVwKClcbiAgICB7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkaXZNb3ZlLCB0cnVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3VzZURvd24oZSl7XG5cbiAgICAgICAgbGV0IGRpdiA9ICcnO1xuXG4gICAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgIGlmKGUudGFyZ2V0LmlkLnRvU3RyaW5nKCkgPT09IG5vZGUuaW5kZXgudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgZGl2ID0gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGUudGFyZ2V0LmlkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgZGl2LnN0eWxlLnpJbmRleCA9ICc5OTk5OTk5J1xuICAgICAgICB9XG5cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9mZlk9IGUuY2xpZW50WS1wYXJzZUludChkaXYub2Zmc2V0VG9wKTtcbiAgICAgICAgb2ZmWD0gZS5jbGllbnRYLXBhcnNlSW50KGRpdi5vZmZzZXRMZWZ0KTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRpdk1vdmUsIHRydWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpdk1vdmUoZSl7XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlLnRhcmdldC5pZC50b1N0cmluZygpKTtcbiAgICAgICAgZGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZGl2LnN0eWxlLnRvcCA9IChlLmNsaWVudFktb2ZmWSkgKyAncHgnO1xuICAgICAgICBkaXYuc3R5bGUubGVmdCA9IChlLmNsaWVudFgtb2ZmWCkgKyAncHgnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlV2luZG93KGUpe1xuICAgICAgICBsZXQgd2luZG93YnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bicpO1xuICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldClcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGUudGFyZ2V0LmlkLnRvU3RyaW5nKCkpXG4gICAgICAgIHN0YXJ0UG9zaXRpb25MZWZ0ICs9IDEwO1xuICAgICAgICBzdGFydFBvc2l0aW9uVG9wICs9IDEwXG5cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwbGljYXRpb25NYW5hZ2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ3JlYXRlZCBieSBla2Vyb3Qgb24gMjAxNi0xMC0xMS5cbiAqL1xuXG5mdW5jdGlvbiB0aW1lKCkge1xuICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IGhvdXIgPSB0b2RheS5nZXRIb3VycygpO1xuICAgIGxldCBtaW51dGVzID0gdG9kYXkuZ2V0TWludXRlcygpO1xuXG4gICAgbWludXRlcyA9IGNoZWNrVGltZShtaW51dGVzKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRpbWVcIikuaW5uZXJIVE1MID0gaG91ciArICc6JyArIG1pbnV0ZXM7XG4gICAgc2V0VGltZW91dCh0aW1lLCA1MDApO1xufVxuXG5mdW5jdGlvbiBjaGVja1RpbWUoaSkge1xuICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgaSA9ICcwJyArIGlcbiAgICB9O1xuICAgIHJldHVybiBpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5jbG9jayA9IHRpbWU7XG4iXX0=
