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




},{"./modules/applicationManager":9,"./modules/clock":10}],2:[function(require,module,exports){
"use strict";

/**
 * Created by ekerot on 2016-10-11.
 */

class ChatApp {

    getName() {
        return 'chat';
    }
}

module.exports = ChatApp;


},{}],3:[function(require,module,exports){
'use strict';

/**
 * Created by ekerot on 2016-10-20.
 */

module.exports = function(index) {

    let tal = index;

    let socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/", "charcords");

    document.getElementById('application').setAttribute('id', 'application' + index);
    let container = document.querySelector('#application'+ index);
    let template = document.querySelectorAll('#chat-container')[0].content;
    let textArea = document.importNode(template, true);
    let text = '';

    document.getElementById(tal).appendChild(container);
    container.appendChild(textArea);

    if (sessionStorage.length > 0) {
        let username = sessionStorage.getItem('user');
        reciveText(tal);
    }

    else{
        setUsername()
    }

    function setUsername() {
        let usernameBox = document.querySelector('.username');
        usernameBox.addEventListener('keydown', userKey);
        usernameBox.classList.toggle('hidden', false);

        function userKey(e) {
            if (e.keyCode == 13) {
                let username = document.querySelector('.username').value;
                usernameBox.value = '';
                sessionStorage.setItem('user', username);
                usernameBox.classList.toggle('hidden', true);
                onReady(username);

            }

        }

    }

    let sender = document.getElementById('application'+tal).lastElementChild.previousElementSibling;

    sender.addEventListener("keydown", pressEnter, false);

    function pressEnter(e){

        if (e.keyCode == 13) {
            sendText();
            event.preventDefault();
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

    }

    function sendText() {

        text = {
            "type": "message",
            "data": sender.value,
            "username": sessionStorage.getItem('user'),
            "channel": "my, not so secret, channel",
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        };


        socket.send(JSON.stringify(text));
        sender.value = '';
    }

    function reciveText(tal) {
        socket.onmessage = function (e) {

            let recive = document.getElementById('application'+tal).lastElementChild.previousElementSibling.previousElementSibling;
            let message = JSON.parse(e.data)
            let today = new Date();
            let hour = today.getHours();
            let minutes = today.getMinutes();

            if (message.type === 'heartbeat') {
                return;
            }

            else {
                recive.textContent += '(' + hour + ':' + minutes + ') ' + message.username + ': ' + message.data + '\n';
            }

            recive.scrollTop = recive.scrollHeight;

        }
    }

}

},{}],4:[function(require,module,exports){
'use strict';

/**
 * Created by ekerot on 2016-10-24.
 */

class Draw {

    getName() {
        return 'draw';
    }
}

module.exports = Draw;

},{}],5:[function(require,module,exports){
/**
 * Created by ekerot on 2016-10-24.
 */

module.exports = function(index) {

    document.getElementById('application').setAttribute('id', 'application' + index);
    let container = document.querySelector('#application' + index);
    let template = document.querySelectorAll('#draw-container')[0].content;
    let drawingArea = document.importNode(template, true);
    let controls = Object.create(null);
    let tools = Object.create(null);

    container.appendChild(drawingArea);

    document.getElementById(index).appendChild(container);

    let parent = document.getElementById('application'+ index);

    function createDraw(parent){

        let canvas = helper('canvas', {width: 595, height: 500});
        let cx = canvas.getContext('2d');
        let toolbar = helper('div', {class: 'toolbar'});
        for (let name in controls){
            toolbar.appendChild(controls[name](cx));
        }

        let panel = helper('div', {class: 'picturepanel'}, canvas);
        parent.appendChild(helper('div', null, panel, toolbar));
    }

    controls.tool = function(cx) {
        let select = helper('select');
        for(let name in tools){
            select.appendChild(helper('option', null, name));
        }

        cx.canvas.addEventListener('mousedown', function (e) {
            if (e.which == 1) {
                tools[select.value](e, cx);
                e.preventDefault();
            }
        });

        return helper('div', null, 'Tool: ', select);
    };

    function relativPosition(e, element){
        let rectangle = element.getBoundingClientRect();

        return {x: Math.floor(e.clientX - rectangle.left)},
        {y: Math.floor(e.clientY - rectangle.top)};
    }

    function trackDrag(onMove, onEnd) {

        function end(e) {
            removeEventListener('mousemove', onMove);
            removeEventListener('mouseup', end);

            if (onEnd) {
                onEnd(e);
            }
            addEventListener('mousemove', onMove);
            addEventListener('mouseup', end);
        }
    }

    tools.Line = function(e, cx, onEnd) {
        cx.lineCap = 'round';

        console.log(e, cx)

        let pos = relativPosition(e, cx.canvas);

        trackDrag(function(event)
        {
            cx.beginPath();
            console.log(cx.moveTo(pos.x, pos.y))
            cx.moveTo(pos.x, pos.y);
            pos = relativPosition(event, cx.canvas);
            cx.lineTo(pos.x, pos.y);
            cx.stroke();
        }, onEnd);

    };

    tools.Erase = function(e, cx){
        cx.globalCompositeOperation = 'destination-out';
        tools.Line(e, cx, function(){
            cx.globalCompositeOperation = 'source-over';
        });
    };

    controls.color = function(cx){
        let input = helper('input', {type: 'color'});
        input.addEventListener('change', function(){
            cx.fillStyle = input.value;
            cx.strokeStyle = input.value;
        });
        return helper('div', null, 'Color: ', input);
    };

    controls.brushSize = function(cx){
        let select = helper('select');
        let size = [1,2,3,5,8,12,25,35,50,75,100];

        size.forEach(function(pixels){
            select.appendChild(helper('option', {value: pixels}, pixels + 'pixels'));
        });

        select.addEventListener('change', function(){
            cx.lineWidth = select.value;
        });
        return helper('div', null, 'Brush size: ', select);
    };

    function helper(name, attributes) {

        let node = document.createElement(name);

        if (attributes) {
            for (let attr in attributes) {
                if (attributes.hasOwnProperty(attr)) {
                    node.setAttribute(attr, attributes[attr]);
                }
            }
        }

        for (let i = 2; i < arguments.length; i += 1) {
            let child = arguments[i];
            if (typeof child == 'string') {
                child = document.createTextNode(child);
            }

            node.appendChild(child);
        }

        return node;
    }

    createDraw(parent);

};

},{}],6:[function(require,module,exports){
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




},{"./chat/chat":2,"./drawIt/draw":4,"./memorygame/memory":7}],7:[function(require,module,exports){
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



},{}],8:[function(require,module,exports){
'use strict';

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






},{}],9:[function(require,module,exports){
'use strict';

/**
 * Created by ekerot on 2016-10-11.
 */
const applications = require('../application/index');
const memoryGame = require('../application/memorygame/memoryGame');
const chat = require('../application/chat/chatApp');
const draw = require('../application/drawIt/drawIt');

let index = 0;
let startPositionTop = 100;
let startPositionLeft = 100;

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

            createWindow();
        });
    });
};

function createWindow(){

    let clonedNode = element.cloneNode(true);
    clonedNode.firstElementChild.setAttribute('id', index.toString());
    let position = clonedNode.getElementById(index.toString());

    if(!checkIfElementIsInsideBody(position)){
        startPositionTop = 10;
        startPositionLeft += 100;
    }

    position.style.top = startPositionTop + 'px';
    position.style.left = startPositionLeft + 'px';

    startPositionTop += 10;
    startPositionLeft += 10;

    position.style.zIndex = (1000 + index);

    let div = document.getElementById('window-position');

    div.appendChild(clonedNode);

    if(event.target.classList.contains('memory')) {
        new memoryGame(4,4,index);
    }

    else if(event.target.classList.contains('chat')){
        new chat(index);

    }

    else if(event.target.classList.contains('draw')){
        position.style.width = 600 + 'px';
        position.style.height = 600 + 'px';
        new draw(index);

    }

    index++;
    configureWindow();
}

function configureWindow() {

    window.onload = addListeners();
    let offX;
    let offY;

    let allNodes = document.querySelectorAll('.window-ui');
    var prev = false;

    for (let i = 0; i < allNodes.length; i++) {
        allNodes[i].onclick = function () {
            if (prev) {
                prev.style.zIndex = 1;
            }
            this.style.zIndex = 1000;
            prev = this;
        }
    }


    function addListeners() {

        let div;

        let allNodes = document.querySelectorAll('.window-ui');

        for (let i = 0; i < allNodes.length; i++) {
                div = document.getElementById(i.toString());
                div.addEventListener('mousedown', mouseDown, false);
                div.addEventListener('mouseup', mouseUp, false);
        }

    }

    function mouseUp() {

        let div;

        for (let i = 0; i < allNodes.length; i++) {
            div = document.getElementById(i.toString());
            div.removeEventListener('mousemove', divMove, true);
        }
    }

    function mouseDown(e) {

        let div;

        for (let i = 0; i < allNodes.length; i++) {

            if (document.getElementById(i.toString()).id == e.target.id) {
                div = document.getElementById(i.toString());
                offY = e.clientY - parseInt(div.offsetTop);
                offX = e.clientX - parseInt(div.offsetLeft);
                div.addEventListener('mousemove', divMove, true);
            }

        }
    }

    function divMove(e) {

        let div;

        for (let i = 0; i < allNodes.length; i++) {

            if (document.getElementById(i.toString()).id == e.target.id) {
                div = document.getElementById(i.toString());

                div.style.position = 'absolute';
                div.style.top = (e.clientY - offY) + 'px';
                div.style.left = (e.clientX - offX) + 'px';

                e.preventDefault();
            }
        }
    }


    for (let i = 0; i < allNodes.length; i++) {
        allNodes[i].firstElementChild.firstElementChild.onclick = function () {
            if (prev) {
                allNodes[i].remove();
                startPositionTop -= 10;
                startPositionLeft -= 10;
            }
        }
    }

}

function checkIfElementIsInsideBody() {

    return startPositionTop < window.innerHeight;
}

module.exports = ApplicationManager;



},{"../application/chat/chatApp":3,"../application/drawIt/drawIt":5,"../application/index":6,"../application/memorygame/memoryGame":8}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuNy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBsaWNhdGlvbi9jaGF0L2NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcGxpY2F0aW9uL2NoYXQvY2hhdEFwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwbGljYXRpb24vZHJhd0l0L2RyYXcuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcGxpY2F0aW9uL2RyYXdJdC9kcmF3SXQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcGxpY2F0aW9uL2luZGV4LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBsaWNhdGlvbi9tZW1vcnlnYW1lL21lbW9yeS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwbGljYXRpb24vbWVtb3J5Z2FtZS9tZW1vcnlHYW1lLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb2R1bGVzL2FwcGxpY2F0aW9uTWFuYWdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbW9kdWxlcy9jbG9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgY2xvY2sgPSByZXF1aXJlKCcuL21vZHVsZXMvY2xvY2snKTtcbmNvbnN0IEFwcGxpY2F0aW9uTWFuYWdlciA9IHJlcXVpcmUoJy4vbW9kdWxlcy9hcHBsaWNhdGlvbk1hbmFnZXInKVxuXG5sZXQgYXBwbGljYWl0b25NYW5hZ2VyID0gbmV3IEFwcGxpY2F0aW9uTWFuYWdlcigpO1xuXG5jbG9jay5jbG9jaygpO1xuYXBwZW5kSWNvbigpO1xuXG5mdW5jdGlvbiBhcHBlbmRJY29uKCl7XG4gICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGxldCB1bCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlzdCcpXG5cbiAgICBhcHBsaWNhaXRvbk1hbmFnZXIuZ2V0QXBwbGljYXRpb25EYXRhKCkuZm9yRWFjaChhcHBEYXRhID0+e1xuXG4gICAgICAgIGxldCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGV0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGxldCBpbWdUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgaW1nVGFnLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS8nICsgYXBwRGF0YS5uYW1lICsgXCIucG5nXCIpO1xuICAgICAgICBpbWdUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsIGFwcERhdGEubmFtZSk7XG4gICAgICAgIGltZ1RhZy5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChpbWdUYWcpO1xuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChsaXN0KTtcblxuICAgIH0pO1xuICAgIHVsLmFwcGVuZENoaWxkKGZyYWdtZW50KTtcbn1cblxuXG5cbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMTEuXG4gKi9cblxuY2xhc3MgQ2hhdEFwcCB7XG5cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gJ2NoYXQnO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0QXBwO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlZCBieSBla2Vyb3Qgb24gMjAxNi0xMC0yMC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICBsZXQgdGFsID0gaW5kZXg7XG5cbiAgICBsZXQgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIsIFwiY2hhcmNvcmRzXCIpO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcGxpY2F0aW9uJykuc2V0QXR0cmlidXRlKCdpZCcsICdhcHBsaWNhdGlvbicgKyBpbmRleCk7XG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHBsaWNhdGlvbicrIGluZGV4KTtcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjY2hhdC1jb250YWluZXInKVswXS5jb250ZW50O1xuICAgIGxldCB0ZXh0QXJlYSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuICAgIGxldCB0ZXh0ID0gJyc7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWwpLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRleHRBcmVhKTtcblxuICAgIGlmIChzZXNzaW9uU3RvcmFnZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCB1c2VybmFtZSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXInKTtcbiAgICAgICAgcmVjaXZlVGV4dCh0YWwpO1xuICAgIH1cblxuICAgIGVsc2V7XG4gICAgICAgIHNldFVzZXJuYW1lKClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRVc2VybmFtZSgpIHtcbiAgICAgICAgbGV0IHVzZXJuYW1lQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJuYW1lJyk7XG4gICAgICAgIHVzZXJuYW1lQm94LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB1c2VyS2V5KTtcbiAgICAgICAgdXNlcm5hbWVCb3guY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJywgZmFsc2UpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHVzZXJLZXkoZSkge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgIGxldCB1c2VybmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VybmFtZScpLnZhbHVlO1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lQm94LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgndXNlcicsIHVzZXJuYW1lKTtcbiAgICAgICAgICAgICAgICB1c2VybmFtZUJveC5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBvblJlYWR5KHVzZXJuYW1lKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGxldCBzZW5kZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwbGljYXRpb24nK3RhbCkubGFzdEVsZW1lbnRDaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgc2VuZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHByZXNzRW50ZXIsIGZhbHNlKTtcblxuICAgIGZ1bmN0aW9uIHByZXNzRW50ZXIoZSl7XG5cbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgc2VuZFRleHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25SZWFkeSh1c2VybmFtZSkge1xuXG4gICAgICAgIHRleHQgPSB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICBcImRhdGFcIjogJycsXG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLFxuICAgICAgICAgICAgXCJjaGFubmVsXCI6IFwibXksIG5vdCBzbyBzZWNyZXQsIGNoYW5uZWxcIixcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh0ZXh0KSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZWNpdmVUZXh0KHRhbCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZW5kVGV4dCgpIHtcblxuICAgICAgICB0ZXh0ID0ge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCI6IHNlbmRlci52YWx1ZSxcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpLFxuICAgICAgICAgICAgXCJjaGFubmVsXCI6IFwibXksIG5vdCBzbyBzZWNyZXQsIGNoYW5uZWxcIixcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgICAgICB9O1xuXG5cbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkodGV4dCkpO1xuICAgICAgICBzZW5kZXIudmFsdWUgPSAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWNpdmVUZXh0KHRhbCkge1xuICAgICAgICBzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgbGV0IHJlY2l2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBsaWNhdGlvbicrdGFsKS5sYXN0RWxlbWVudENoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGxldCBtZXNzYWdlID0gSlNPTi5wYXJzZShlLmRhdGEpXG4gICAgICAgICAgICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgbGV0IGhvdXIgPSB0b2RheS5nZXRIb3VycygpO1xuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSB0b2RheS5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdoZWFydGJlYXQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWNpdmUudGV4dENvbnRlbnQgKz0gJygnICsgaG91ciArICc6JyArIG1pbnV0ZXMgKyAnKSAnICsgbWVzc2FnZS51c2VybmFtZSArICc6ICcgKyBtZXNzYWdlLmRhdGEgKyAnXFxuJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVjaXZlLnNjcm9sbFRvcCA9IHJlY2l2ZS5zY3JvbGxIZWlnaHQ7XG5cbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMjQuXG4gKi9cblxuY2xhc3MgRHJhdyB7XG5cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gJ2RyYXcnO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEcmF3O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTI0LlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBsaWNhdGlvbicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnYXBwbGljYXRpb24nICsgaW5kZXgpO1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwbGljYXRpb24nICsgaW5kZXgpO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNkcmF3LWNvbnRhaW5lcicpWzBdLmNvbnRlbnQ7XG4gICAgbGV0IGRyYXdpbmdBcmVhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG4gICAgbGV0IGNvbnRyb2xzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBsZXQgdG9vbHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRyYXdpbmdBcmVhKTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGluZGV4KS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXG4gICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBsaWNhdGlvbicrIGluZGV4KTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZURyYXcocGFyZW50KXtcblxuICAgICAgICBsZXQgY2FudmFzID0gaGVscGVyKCdjYW52YXMnLCB7d2lkdGg6IDU5NSwgaGVpZ2h0OiA1MDB9KTtcbiAgICAgICAgbGV0IGN4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIGxldCB0b29sYmFyID0gaGVscGVyKCdkaXYnLCB7Y2xhc3M6ICd0b29sYmFyJ30pO1xuICAgICAgICBmb3IgKGxldCBuYW1lIGluIGNvbnRyb2xzKXtcbiAgICAgICAgICAgIHRvb2xiYXIuYXBwZW5kQ2hpbGQoY29udHJvbHNbbmFtZV0oY3gpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYW5lbCA9IGhlbHBlcignZGl2Jywge2NsYXNzOiAncGljdHVyZXBhbmVsJ30sIGNhbnZhcyk7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChoZWxwZXIoJ2RpdicsIG51bGwsIHBhbmVsLCB0b29sYmFyKSk7XG4gICAgfVxuXG4gICAgY29udHJvbHMudG9vbCA9IGZ1bmN0aW9uKGN4KSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBoZWxwZXIoJ3NlbGVjdCcpO1xuICAgICAgICBmb3IobGV0IG5hbWUgaW4gdG9vbHMpe1xuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKGhlbHBlcignb3B0aW9uJywgbnVsbCwgbmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3guY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgdG9vbHNbc2VsZWN0LnZhbHVlXShlLCBjeCk7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaGVscGVyKCdkaXYnLCBudWxsLCAnVG9vbDogJywgc2VsZWN0KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcmVsYXRpdlBvc2l0aW9uKGUsIGVsZW1lbnQpe1xuICAgICAgICBsZXQgcmVjdGFuZ2xlID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICByZXR1cm4ge3g6IE1hdGguZmxvb3IoZS5jbGllbnRYIC0gcmVjdGFuZ2xlLmxlZnQpfSxcbiAgICAgICAge3k6IE1hdGguZmxvb3IoZS5jbGllbnRZIC0gcmVjdGFuZ2xlLnRvcCl9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYWNrRHJhZyhvbk1vdmUsIG9uRW5kKSB7XG5cbiAgICAgICAgZnVuY3Rpb24gZW5kKGUpIHtcbiAgICAgICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW92ZSk7XG4gICAgICAgICAgICByZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZW5kKTtcblxuICAgICAgICAgICAgaWYgKG9uRW5kKSB7XG4gICAgICAgICAgICAgICAgb25FbmQoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdmUpO1xuICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVuZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b29scy5MaW5lID0gZnVuY3Rpb24oZSwgY3gsIG9uRW5kKSB7XG4gICAgICAgIGN4LmxpbmVDYXAgPSAncm91bmQnO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGUsIGN4KVxuXG4gICAgICAgIGxldCBwb3MgPSByZWxhdGl2UG9zaXRpb24oZSwgY3guY2FudmFzKTtcblxuICAgICAgICB0cmFja0RyYWcoZnVuY3Rpb24oZXZlbnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGN4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coY3gubW92ZVRvKHBvcy54LCBwb3MueSkpXG4gICAgICAgICAgICBjeC5tb3ZlVG8ocG9zLngsIHBvcy55KTtcbiAgICAgICAgICAgIHBvcyA9IHJlbGF0aXZQb3NpdGlvbihldmVudCwgY3guY2FudmFzKTtcbiAgICAgICAgICAgIGN4LmxpbmVUbyhwb3MueCwgcG9zLnkpO1xuICAgICAgICAgICAgY3guc3Ryb2tlKCk7XG4gICAgICAgIH0sIG9uRW5kKTtcblxuICAgIH07XG5cbiAgICB0b29scy5FcmFzZSA9IGZ1bmN0aW9uKGUsIGN4KXtcbiAgICAgICAgY3guZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW91dCc7XG4gICAgICAgIHRvb2xzLkxpbmUoZSwgY3gsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjeC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnc291cmNlLW92ZXInO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29udHJvbHMuY29sb3IgPSBmdW5jdGlvbihjeCl7XG4gICAgICAgIGxldCBpbnB1dCA9IGhlbHBlcignaW5wdXQnLCB7dHlwZTogJ2NvbG9yJ30pO1xuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgY3guZmlsbFN0eWxlID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBjeC5zdHJva2VTdHlsZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGhlbHBlcignZGl2JywgbnVsbCwgJ0NvbG9yOiAnLCBpbnB1dCk7XG4gICAgfTtcblxuICAgIGNvbnRyb2xzLmJydXNoU2l6ZSA9IGZ1bmN0aW9uKGN4KXtcbiAgICAgICAgbGV0IHNlbGVjdCA9IGhlbHBlcignc2VsZWN0Jyk7XG4gICAgICAgIGxldCBzaXplID0gWzEsMiwzLDUsOCwxMiwyNSwzNSw1MCw3NSwxMDBdO1xuXG4gICAgICAgIHNpemUuZm9yRWFjaChmdW5jdGlvbihwaXhlbHMpe1xuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKGhlbHBlcignb3B0aW9uJywge3ZhbHVlOiBwaXhlbHN9LCBwaXhlbHMgKyAncGl4ZWxzJykpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGN4LmxpbmVXaWR0aCA9IHNlbGVjdC52YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBoZWxwZXIoJ2RpdicsIG51bGwsICdCcnVzaCBzaXplOiAnLCBzZWxlY3QpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBoZWxwZXIobmFtZSwgYXR0cmlidXRlcykge1xuXG4gICAgICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKTtcblxuICAgICAgICBpZiAoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgYXR0ciBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ciwgYXR0cmlidXRlc1thdHRyXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hpbGQgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoaWxkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBjcmVhdGVEcmF3KHBhcmVudCk7XG5cbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMTEuXG4gKi9cblxuY29uc3QgQ2hhdEFwcCAgPSByZXF1aXJlKCcuL2NoYXQvY2hhdCcpO1xuXG5jb25zdCBNZW1vcnkgPSByZXF1aXJlKCcuL21lbW9yeWdhbWUvbWVtb3J5Jyk7XG5cbmNvbnN0IERyYXcgPSByZXF1aXJlKCcuL2RyYXdJdC9kcmF3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gW1xuICAgIG5ldyBDaGF0QXBwKCksXG4gICAgbmV3IE1lbW9yeSgpLFxuICAgIG5ldyBEcmF3KClcbl07XG5cblxuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTExLlxuICovXG5cbmNsYXNzIE1lbW9yeSB7XG5cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gJ21lbW9yeSc7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMTkuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyb3dzLCBjb2x1bW5zLCBpbmRleCkge1xuICAgIGxldCBpO1xuICAgIGxldCBhO1xuICAgIGxldCB0aWxlcyA9IFtdO1xuICAgIGxldCB0dXJuMTtcbiAgICBsZXQgdHVybjI7XG4gICAgbGV0IGxhc3RUaWxlO1xuICAgIGxldCB0cmllcyA9IDA7XG4gICAgbGV0IHBhaXJzID0gMDtcblxuICAgIHRpbGVzID0gZ2V0UGljdHVyZShyb3dzLGNvbHVtbnMpXG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwbGljYXRpb24nKS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2FwcGxpY2F0aW9uJyArIGluZGV4KTtcbiAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FwcGxpY2F0aW9uJysgaW5kZXgpO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNtZW1vcnktY29udGFpbmVyJylbMF0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgIHRpbGVzLmZvckVhY2goZnVuY3Rpb24odGlsZSwgaW5kZXgpIHtcblxuICAgICAgICBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG5cbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xuXG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgbGV0IGltZyA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lNRycgPyBldmVudC50YXJnZXQgOiBldmVudC50YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICAgICAgICAgIHR1cm5UaWxlKHRpbGUsaW5kZXgsaW1nKVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoKGkgKyAxKSAlIGNvbHVtbnMgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gdHVyblRpbGUodGlsZSxpbmRleCwgZWxlbWVudCl7XG5cbiAgICAgICAgaWYodHVybjIpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50LnNyYz1cImltYWdlL21lbW9yeWltYWdlcy9cIit0aWxlK1wiLnBuZ1wiO1xuXG4gICAgICAgIGlmICghdHVybjEpe1xuICAgICAgICAgICAgdHVybjEgPSBlbGVtZW50O1xuICAgICAgICAgICAgbGFzdFRpbGUgPSB0aWxlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHR1cm4yID0gZWxlbWVudDtcbiAgICAgICAgICAgIHRyaWVzICs9IDE7XG5cbiAgICAgICAgICAgIGlmKGVsZW1lbnQgPT09IHR1cm4xKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxhc3RUaWxlID09PSB0aWxlKXtcbiAgICAgICAgICAgICAgICB0dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3JlbW92ZWQnKTtcbiAgICAgICAgICAgICAgICB0dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3JlbW92ZWQnKTtcbiAgICAgICAgICAgICAgICBwYWlycyArPSAxO1xuICAgICAgICAgICAgICAgIHR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYocGFpcnMgPT09IChjb2x1bW5zKnJvd3MpLzIpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWW91IHdvbiBhdCAnICsgdHJpZXMgKyAnIHRyaWVzIScpO1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIudGV4dENvbnRlbnQgPSAnWW91IHdvbiBhdCAnICsgdHJpZXMgKyAnIHRyaWVzISc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHR1cm4xLnNyYyA9ICcvaW1hZ2UvbWVtb3J5aW1hZ2VzLzAucG5nJ1xuICAgICAgICAgICAgICAgICAgICB0dXJuMi5zcmMgPSAnL2ltYWdlL21lbW9yeWltYWdlcy8wLnBuZydcbiAgICAgICAgICAgICAgICAgICAgdHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSwgMjAwKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQaWN0dXJlKHJvd3MsIGNvbHVtbnMpe1xuXG4gICAgICAgIGxldCBhcnIgPSBbXTtcbiAgICAgICAgbGV0IGk7XG5cbiAgICAgICAgZm9yIChpPTE7IGkgPD0gKHJvd3MqY29sdW1ucykvMjsgaSsrKSB7XG4gICAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCAgaSA9IGFyci5sZW5ndGgtMTsgaSA+IDA7IGktLSl7XG5cbiAgICAgICAgICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgICAgICBsZXQgdGVtcCA9IGFycltpXTtcbiAgICAgICAgICAgIGFycltpXSA9IGFycltqXTtcbiAgICAgICAgICAgIGFycltqXSA9IHRlbXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyO1xuXG4gICAgfVxuXG59XG5cblxuXG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMTEuXG4gKi9cbmNvbnN0IGFwcGxpY2F0aW9ucyA9IHJlcXVpcmUoJy4uL2FwcGxpY2F0aW9uL2luZGV4Jyk7XG5jb25zdCBtZW1vcnlHYW1lID0gcmVxdWlyZSgnLi4vYXBwbGljYXRpb24vbWVtb3J5Z2FtZS9tZW1vcnlHYW1lJyk7XG5jb25zdCBjaGF0ID0gcmVxdWlyZSgnLi4vYXBwbGljYXRpb24vY2hhdC9jaGF0QXBwJyk7XG5jb25zdCBkcmF3ID0gcmVxdWlyZSgnLi4vYXBwbGljYXRpb24vZHJhd0l0L2RyYXdJdCcpO1xuXG5sZXQgaW5kZXggPSAwO1xubGV0IHN0YXJ0UG9zaXRpb25Ub3AgPSAxMDA7XG5sZXQgc3RhcnRQb3NpdGlvbkxlZnQgPSAxMDA7XG5cbmNsYXNzIEFwcGxpY2F0aW9uTWFuYWdlciB7XG4gICAgZ2V0QXBwbGljYXRpb25EYXRhKCkge1xuICAgICAgICByZXR1cm4gYXBwbGljYXRpb25zLm1hcChhcHAgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtuYW1lOiBhcHAuZ2V0TmFtZSgpfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZW1wbGF0ZScpLFxuICAgIGVsZW1lbnQ7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiBiZWZvcmVDcmVhdGUoKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgbGV0IGltZ1RhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpID4gaW1nJyk7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChpbWdUYWcsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIGNyZWF0ZVdpbmRvdygpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpe1xuXG4gICAgbGV0IGNsb25lZE5vZGUgPSBlbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICBjbG9uZWROb2RlLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZSgnaWQnLCBpbmRleC50b1N0cmluZygpKTtcbiAgICBsZXQgcG9zaXRpb24gPSBjbG9uZWROb2RlLmdldEVsZW1lbnRCeUlkKGluZGV4LnRvU3RyaW5nKCkpO1xuXG4gICAgaWYoIWNoZWNrSWZFbGVtZW50SXNJbnNpZGVCb2R5KHBvc2l0aW9uKSl7XG4gICAgICAgIHN0YXJ0UG9zaXRpb25Ub3AgPSAxMDtcbiAgICAgICAgc3RhcnRQb3NpdGlvbkxlZnQgKz0gMTAwO1xuICAgIH1cblxuICAgIHBvc2l0aW9uLnN0eWxlLnRvcCA9IHN0YXJ0UG9zaXRpb25Ub3AgKyAncHgnO1xuICAgIHBvc2l0aW9uLnN0eWxlLmxlZnQgPSBzdGFydFBvc2l0aW9uTGVmdCArICdweCc7XG5cbiAgICBzdGFydFBvc2l0aW9uVG9wICs9IDEwO1xuICAgIHN0YXJ0UG9zaXRpb25MZWZ0ICs9IDEwO1xuXG4gICAgcG9zaXRpb24uc3R5bGUuekluZGV4ID0gKDEwMDAgKyBpbmRleCk7XG5cbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpbmRvdy1wb3NpdGlvbicpO1xuXG4gICAgZGl2LmFwcGVuZENoaWxkKGNsb25lZE5vZGUpO1xuXG4gICAgaWYoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWVtb3J5JykpIHtcbiAgICAgICAgbmV3IG1lbW9yeUdhbWUoNCw0LGluZGV4KTtcbiAgICB9XG5cbiAgICBlbHNlIGlmKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NoYXQnKSl7XG4gICAgICAgIG5ldyBjaGF0KGluZGV4KTtcblxuICAgIH1cblxuICAgIGVsc2UgaWYoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnZHJhdycpKXtcbiAgICAgICAgcG9zaXRpb24uc3R5bGUud2lkdGggPSA2MDAgKyAncHgnO1xuICAgICAgICBwb3NpdGlvbi5zdHlsZS5oZWlnaHQgPSA2MDAgKyAncHgnO1xuICAgICAgICBuZXcgZHJhdyhpbmRleCk7XG5cbiAgICB9XG5cbiAgICBpbmRleCsrO1xuICAgIGNvbmZpZ3VyZVdpbmRvdygpO1xufVxuXG5mdW5jdGlvbiBjb25maWd1cmVXaW5kb3coKSB7XG5cbiAgICB3aW5kb3cub25sb2FkID0gYWRkTGlzdGVuZXJzKCk7XG4gICAgbGV0IG9mZlg7XG4gICAgbGV0IG9mZlk7XG5cbiAgICBsZXQgYWxsTm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2luZG93LXVpJyk7XG4gICAgdmFyIHByZXYgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYWxsTm9kZXNbaV0ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgICAgICAgcHJldi5zdHlsZS56SW5kZXggPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdHlsZS56SW5kZXggPSAxMDAwO1xuICAgICAgICAgICAgcHJldiA9IHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcblxuICAgICAgICBsZXQgZGl2O1xuXG4gICAgICAgIGxldCBhbGxOb2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aW5kb3ctdWknKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG5cbiAgICAgICAgbGV0IGRpdjtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgZGl2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRpdk1vdmUsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW91c2VEb3duKGUpIHtcblxuICAgICAgICBsZXQgZGl2O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGkudG9TdHJpbmcoKSkuaWQgPT0gZS50YXJnZXQuaWQpIHtcbiAgICAgICAgICAgICAgICBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIG9mZlkgPSBlLmNsaWVudFkgLSBwYXJzZUludChkaXYub2Zmc2V0VG9wKTtcbiAgICAgICAgICAgICAgICBvZmZYID0gZS5jbGllbnRYIC0gcGFyc2VJbnQoZGl2Lm9mZnNldExlZnQpO1xuICAgICAgICAgICAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkaXZNb3ZlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGl2TW92ZShlKSB7XG5cbiAgICAgICAgbGV0IGRpdjtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpLnRvU3RyaW5nKCkpLmlkID09IGUudGFyZ2V0LmlkKSB7XG4gICAgICAgICAgICAgICAgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaS50b1N0cmluZygpKTtcblxuICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgZGl2LnN0eWxlLnRvcCA9IChlLmNsaWVudFkgLSBvZmZZKSArICdweCc7XG4gICAgICAgICAgICAgICAgZGl2LnN0eWxlLmxlZnQgPSAoZS5jbGllbnRYIC0gb2ZmWCkgKyAncHgnO1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFsbE5vZGVzW2ldLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocHJldikge1xuICAgICAgICAgICAgICAgIGFsbE5vZGVzW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb25Ub3AgLT0gMTA7XG4gICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvbkxlZnQgLT0gMTA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gY2hlY2tJZkVsZW1lbnRJc0luc2lkZUJvZHkoKSB7XG5cbiAgICByZXR1cm4gc3RhcnRQb3NpdGlvblRvcCA8IHdpbmRvdy5pbm5lckhlaWdodDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBsaWNhdGlvbk1hbmFnZXI7XG5cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ3JlYXRlZCBieSBla2Vyb3Qgb24gMjAxNi0xMC0xMS5cbiAqL1xuXG5mdW5jdGlvbiB0aW1lKCkge1xuICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IGhvdXIgPSB0b2RheS5nZXRIb3VycygpO1xuICAgIGxldCBtaW51dGVzID0gdG9kYXkuZ2V0TWludXRlcygpO1xuXG4gICAgbWludXRlcyA9IGNoZWNrVGltZShtaW51dGVzKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRpbWVcIikuaW5uZXJIVE1MID0gaG91ciArICc6JyArIG1pbnV0ZXM7XG4gICAgc2V0VGltZW91dCh0aW1lLCA1MDApO1xufVxuXG5mdW5jdGlvbiBjaGVja1RpbWUoaSkge1xuICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgaSA9ICcwJyArIGlcbiAgICB9O1xuICAgIHJldHVybiBpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5jbG9jayA9IHRpbWU7XG4iXX0=
