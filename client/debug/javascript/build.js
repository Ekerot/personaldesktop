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

            let oldmessages = localStorage.getItem('lastchat');
            let cache = JSON.stringify({time: hour + minutes, username: message.username, message: message.data}) + oldmessages;

            console.log(cache.length)

                if(cache.length > 5000){
                        cache = JSON.stringify({time: hour + minutes, username: message.username, message: message.data})

                }

            localStorage.setItem('lastchat', cache);


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

    container.appendChild(drawingArea);

    let canvas = document.createElement('canvas');

    let canvasDiv = document.getElementById('application'+index).lastElementChild.previousElementSibling;
    canvas.setAttribute('class', 'canvas');
    canvas.setAttribute('width', '595px');
    canvas.setAttribute('height', '500px')
    canvasDiv.appendChild(canvas);

    let cx = canvas.getContext('2d');
    let mouse = {x: 0, y: 0};

    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.pageX - canvas.getBoundingClientRect().left;
        mouse.y = e.pageY - canvas.getBoundingClientRect().top;
    });

    setColor();
    setBrushSize()

    canvas.addEventListener('mousedown', function() {
        cx.beginPath();
        cx.moveTo(mouse.x, mouse.y);

        canvas.addEventListener('mousemove', paint, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', paint, false);
    }, false);

    let paint = function() {
        cx.lineTo(mouse.x, mouse.y);
        cx.stroke();
    };


    function setColor(){

        let colorSelector = document.getElementById('setcolor');

        colorSelector.addEventListener('change', function () {

            cx.fillStyle = colorSelector.value
            cx.strokeStyle = colorSelector.value
        })

    }

    function setBrushSize(){

        let brushsize = document.getElementById('brushsize');
        cx.lineCap = 'round';

        brushsize.addEventListener('change', function () {

            cx.lineWidth = brushsize.value;
        })

    }

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
            templateResult.textContent = 'Number of tries: ' + tries;
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
                    templateResult.textContent = 'You won at ' + tries + ' tries!';
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
        position.style.width = 300 + 'px';
        position.style.height = 320 + 'px';
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

        document.body.addEventListener('mousedown', mouseDown, false);
        window.addEventListener('mouseup', mouseUp, false);

    }

    function mouseUp() {
        window.removeEventListener('mousemove', divMove, true);
    }

    function mouseDown(e) {

        let div;

        for (let i = 0; i < allNodes.length; i++) {

            if (document.getElementById(i.toString()).id == e.target.id) {
                div = document.getElementById(i.toString());
                offY = e.clientY - parseInt(div.offsetTop);
                offX = e.clientX - parseInt(div.offsetLeft);
                window.addEventListener('mousemove', divMove, true);
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
        allNodes[i].firstElementChild.firstElementChild.onclick = function close() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuNy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBsaWNhdGlvbi9jaGF0L2NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcGxpY2F0aW9uL2NoYXQvY2hhdEFwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwbGljYXRpb24vZHJhd0l0L2RyYXcuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcGxpY2F0aW9uL2RyYXdJdC9kcmF3SXQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcGxpY2F0aW9uL2luZGV4LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBsaWNhdGlvbi9tZW1vcnlnYW1lL21lbW9yeS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwbGljYXRpb24vbWVtb3J5Z2FtZS9tZW1vcnlHYW1lLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb2R1bGVzL2FwcGxpY2F0aW9uTWFuYWdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbW9kdWxlcy9jbG9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IGNsb2NrID0gcmVxdWlyZSgnLi9tb2R1bGVzL2Nsb2NrJyk7XG5jb25zdCBBcHBsaWNhdGlvbk1hbmFnZXIgPSByZXF1aXJlKCcuL21vZHVsZXMvYXBwbGljYXRpb25NYW5hZ2VyJylcblxubGV0IGFwcGxpY2FpdG9uTWFuYWdlciA9IG5ldyBBcHBsaWNhdGlvbk1hbmFnZXIoKTtcblxuY2xvY2suY2xvY2soKTtcbmFwcGVuZEljb24oKTtcblxuZnVuY3Rpb24gYXBwZW5kSWNvbigpe1xuICAgIGxldCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBsZXQgdWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWxpc3QnKVxuXG4gICAgYXBwbGljYWl0b25NYW5hZ2VyLmdldEFwcGxpY2F0aW9uRGF0YSgpLmZvckVhY2goYXBwRGF0YSA9PntcblxuICAgICAgICBsZXQgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGxldCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBsZXQgaW1nVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGltZ1RhZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvJyArIGFwcERhdGEubmFtZSArIFwiLnBuZ1wiKTtcbiAgICAgICAgaW1nVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBhcHBEYXRhLm5hbWUpO1xuICAgICAgICBpbWdUYWcuYXBwZW5kQ2hpbGQoYSk7XG4gICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaW1nVGFnKTtcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQobGlzdCk7XG5cbiAgICB9KTtcbiAgICB1bC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG59XG5cblxuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTExLlxuICovXG5cbmNsYXNzIENoYXRBcHAge1xuXG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdjaGF0JztcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdEFwcDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMjAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbmRleCkge1xuXG4gICAgbGV0IHRhbCA9IGluZGV4O1xuXG4gICAgbGV0IHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiLCBcImNoYXJjb3Jkc1wiKTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBsaWNhdGlvbicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnYXBwbGljYXRpb24nICsgaW5kZXgpO1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwbGljYXRpb24nKyBpbmRleCk7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2NoYXQtY29udGFpbmVyJylbMF0uY29udGVudDtcbiAgICBsZXQgdGV4dEFyZWEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcbiAgICBsZXQgdGV4dCA9ICcnO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFsKS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZXh0QXJlYSk7XG5cbiAgICBpZiAoc2Vzc2lvblN0b3JhZ2UubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgdXNlcm5hbWUgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VyJyk7XG4gICAgICAgIHJlY2l2ZVRleHQodGFsKTtcbiAgICB9XG5cbiAgICBlbHNle1xuICAgICAgICBzZXRVc2VybmFtZSgpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VXNlcm5hbWUoKSB7XG4gICAgICAgIGxldCB1c2VybmFtZUJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VybmFtZScpO1xuICAgICAgICB1c2VybmFtZUJveC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdXNlcktleSk7XG4gICAgICAgIHVzZXJuYW1lQm94LmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicsIGZhbHNlKTtcblxuICAgICAgICBmdW5jdGlvbiB1c2VyS2V5KGUpIHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICBsZXQgdXNlcm5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXNlcm5hbWUnKS52YWx1ZTtcbiAgICAgICAgICAgICAgICB1c2VybmFtZUJveC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCB1c2VybmFtZSk7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWVCb3guY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgb25SZWFkeSh1c2VybmFtZSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBsZXQgc2VuZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcGxpY2F0aW9uJyt0YWwpLmxhc3RFbGVtZW50Q2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICAgIHNlbmRlci5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBwcmVzc0VudGVyLCBmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiBwcmVzc0VudGVyKGUpe1xuXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgIHNlbmRUZXh0KCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uUmVhZHkodXNlcm5hbWUpIHtcblxuICAgICAgICB0ZXh0ID0ge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCI6ICcnLFxuICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSxcbiAgICAgICAgICAgIFwiY2hhbm5lbFwiOiBcIm15LCBub3Qgc28gc2VjcmV0LCBjaGFubmVsXCIsXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcbiAgICAgICAgfTtcblxuICAgICAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkodGV4dCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVjaXZlVGV4dCh0YWwpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2VuZFRleHQoKSB7XG5cbiAgICAgICAgdGV4dCA9IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgIFwiZGF0YVwiOiBzZW5kZXIudmFsdWUsXG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXInKSxcbiAgICAgICAgICAgIFwiY2hhbm5lbFwiOiBcIm15LCBub3Qgc28gc2VjcmV0LCBjaGFubmVsXCIsXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHRleHQpKTtcbiAgICAgICAgc2VuZGVyLnZhbHVlID0gJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVjaXZlVGV4dCh0YWwpIHtcbiAgICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChlKSB7XG5cbiAgICAgICAgICAgIGxldCByZWNpdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwbGljYXRpb24nK3RhbCkubGFzdEVsZW1lbnRDaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBsZXQgbWVzc2FnZSA9IEpTT04ucGFyc2UoZS5kYXRhKVxuICAgICAgICAgICAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGxldCBob3VyID0gdG9kYXkuZ2V0SG91cnMoKTtcbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gdG9kYXkuZ2V0TWludXRlcygpO1xuXG4gICAgICAgICAgICBpZiAobWVzc2FnZS50eXBlID09PSAnaGVhcnRiZWF0Jykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVjaXZlLnRleHRDb250ZW50ICs9ICcoJyArIGhvdXIgKyAnOicgKyBtaW51dGVzICsgJykgJyArIG1lc3NhZ2UudXNlcm5hbWUgKyAnOiAnICsgbWVzc2FnZS5kYXRhICsgJ1xcbic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWNpdmUuc2Nyb2xsVG9wID0gcmVjaXZlLnNjcm9sbEhlaWdodDtcblxuICAgICAgICAgICAgbGV0IG9sZG1lc3NhZ2VzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xhc3RjaGF0Jyk7XG4gICAgICAgICAgICBsZXQgY2FjaGUgPSBKU09OLnN0cmluZ2lmeSh7dGltZTogaG91ciArIG1pbnV0ZXMsIHVzZXJuYW1lOiBtZXNzYWdlLnVzZXJuYW1lLCBtZXNzYWdlOiBtZXNzYWdlLmRhdGF9KSArIG9sZG1lc3NhZ2VzO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYWNoZS5sZW5ndGgpXG5cbiAgICAgICAgICAgICAgICBpZihjYWNoZS5sZW5ndGggPiA1MDAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlID0gSlNPTi5zdHJpbmdpZnkoe3RpbWU6IGhvdXIgKyBtaW51dGVzLCB1c2VybmFtZTogbWVzc2FnZS51c2VybmFtZSwgbWVzc2FnZTogbWVzc2FnZS5kYXRhfSlcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RjaGF0JywgY2FjaGUpO1xuXG5cbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMjQuXG4gKi9cblxuY2xhc3MgRHJhdyB7XG5cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gJ2RyYXcnO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEcmF3O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTI0LlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBsaWNhdGlvbicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnYXBwbGljYXRpb24nICsgaW5kZXgpO1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwbGljYXRpb24nICsgaW5kZXgpO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNkcmF3LWNvbnRhaW5lcicpWzBdLmNvbnRlbnQ7XG4gICAgbGV0IGRyYXdpbmdBcmVhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZHJhd2luZ0FyZWEpO1xuXG4gICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXG4gICAgbGV0IGNhbnZhc0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBsaWNhdGlvbicraW5kZXgpLmxhc3RFbGVtZW50Q2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjYW52YXMnKTtcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsICc1OTVweCcpO1xuICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICc1MDBweCcpXG4gICAgY2FudmFzRGl2LmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cbiAgICBsZXQgY3ggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBsZXQgbW91c2UgPSB7eDogMCwgeTogMH07XG5cbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBtb3VzZS54ID0gZS5wYWdlWCAtIGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgICAgICBtb3VzZS55ID0gZS5wYWdlWSAtIGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgfSk7XG5cbiAgICBzZXRDb2xvcigpO1xuICAgIHNldEJydXNoU2l6ZSgpXG5cbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGN4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjeC5tb3ZlVG8obW91c2UueCwgbW91c2UueSk7XG5cbiAgICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHBhaW50LCBmYWxzZSk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHBhaW50LCBmYWxzZSk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgbGV0IHBhaW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGN4LmxpbmVUbyhtb3VzZS54LCBtb3VzZS55KTtcbiAgICAgICAgY3guc3Ryb2tlKCk7XG4gICAgfTtcblxuXG4gICAgZnVuY3Rpb24gc2V0Q29sb3IoKXtcblxuICAgICAgICBsZXQgY29sb3JTZWxlY3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXRjb2xvcicpO1xuXG4gICAgICAgIGNvbG9yU2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBjeC5maWxsU3R5bGUgPSBjb2xvclNlbGVjdG9yLnZhbHVlXG4gICAgICAgICAgICBjeC5zdHJva2VTdHlsZSA9IGNvbG9yU2VsZWN0b3IudmFsdWVcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldEJydXNoU2l6ZSgpe1xuXG4gICAgICAgIGxldCBicnVzaHNpemUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnJ1c2hzaXplJyk7XG4gICAgICAgIGN4LmxpbmVDYXAgPSAncm91bmQnO1xuXG4gICAgICAgIGJydXNoc2l6ZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIGN4LmxpbmVXaWR0aCA9IGJydXNoc2l6ZS52YWx1ZTtcbiAgICAgICAgfSlcblxuICAgIH1cblxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBla2Vyb3Qgb24gMjAxNi0xMC0xMS5cbiAqL1xuXG5jb25zdCBDaGF0QXBwICA9IHJlcXVpcmUoJy4vY2hhdC9jaGF0Jyk7XG5cbmNvbnN0IE1lbW9yeSA9IHJlcXVpcmUoJy4vbWVtb3J5Z2FtZS9tZW1vcnknKTtcblxuY29uc3QgRHJhdyA9IHJlcXVpcmUoJy4vZHJhd0l0L2RyYXcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBbXG4gICAgbmV3IENoYXRBcHAoKSxcbiAgICBuZXcgTWVtb3J5KCksXG4gICAgbmV3IERyYXcoKVxuXTtcblxuXG5cbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMTEuXG4gKi9cblxuY2xhc3MgTWVtb3J5IHtcblxuICAgIGdldE5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnbWVtb3J5JztcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcblxuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlZCBieSBla2Vyb3Qgb24gMjAxNi0xMC0xOS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJvd3MsIGNvbHVtbnMsIGluZGV4KSB7XG4gICAgbGV0IGk7XG4gICAgbGV0IGE7XG4gICAgbGV0IHRpbGVzID0gW107XG4gICAgbGV0IHR1cm4xO1xuICAgIGxldCB0dXJuMjtcbiAgICBsZXQgbGFzdFRpbGU7XG4gICAgbGV0IHRyaWVzID0gMDtcbiAgICBsZXQgcGFpcnMgPSAwO1xuXG4gICAgdGlsZXMgPSBnZXRQaWN0dXJlKHJvd3MsY29sdW1ucylcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBsaWNhdGlvbicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnYXBwbGljYXRpb24nICsgaW5kZXgpO1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwbGljYXRpb24nKyBpbmRleCk7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI21lbW9yeS1jb250YWluZXInKVswXS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgdGlsZXMuZm9yRWFjaChmdW5jdGlvbih0aWxlLCBpbmRleCkge1xuXG4gICAgICAgIGEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcblxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYSk7XG5cbiAgICAgICAgYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICBsZXQgaW1nID0gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSAnSU1HJyA/IGV2ZW50LnRhcmdldCA6IGV2ZW50LnRhcmdldC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgICAgICAgICAgdHVyblRpbGUodGlsZSxpbmRleCxpbWcpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICgoaSArIDEpICUgY29sdW1ucyA9PT0gMCkge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiB0dXJuVGlsZSh0aWxlLGluZGV4LCBlbGVtZW50KXtcblxuICAgICAgICBpZih0dXJuMil7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5zcmM9XCJpbWFnZS9tZW1vcnlpbWFnZXMvXCIrdGlsZStcIi5wbmdcIjtcblxuICAgICAgICBpZiAoIXR1cm4xKXtcbiAgICAgICAgICAgIHR1cm4xID0gZWxlbWVudDtcbiAgICAgICAgICAgIGxhc3RUaWxlID0gdGlsZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB0dXJuMiA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB0ZW1wbGF0ZVJlc3VsdC50ZXh0Q29udGVudCA9ICdOdW1iZXIgb2YgdHJpZXM6ICcgKyB0cmllcztcbiAgICAgICAgICAgIHRyaWVzICs9IDE7XG5cbiAgICAgICAgICAgIGlmKGVsZW1lbnQgPT09IHR1cm4xKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxhc3RUaWxlID09PSB0aWxlKXtcbiAgICAgICAgICAgICAgICB0dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3JlbW92ZWQnKTtcbiAgICAgICAgICAgICAgICB0dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3JlbW92ZWQnKTtcbiAgICAgICAgICAgICAgICBwYWlycyArPSAxO1xuICAgICAgICAgICAgICAgIHR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYocGFpcnMgPT09IChjb2x1bW5zKnJvd3MpLzIpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWW91IHdvbiBhdCAnICsgdHJpZXMgKyAnIHRyaWVzIScpO1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVJlc3VsdC50ZXh0Q29udGVudCA9ICdZb3Ugd29uIGF0ICcgKyB0cmllcyArICcgdHJpZXMhJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdHVybjEuc3JjID0gJy9pbWFnZS9tZW1vcnlpbWFnZXMvMC5wbmcnXG4gICAgICAgICAgICAgICAgICAgIHR1cm4yLnNyYyA9ICcvaW1hZ2UvbWVtb3J5aW1hZ2VzLzAucG5nJ1xuICAgICAgICAgICAgICAgICAgICB0dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHR1cm4yID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9LCAyMDApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBpY3R1cmUocm93cywgY29sdW1ucyl7XG5cbiAgICAgICAgbGV0IGFyciA9IFtdO1xuICAgICAgICBsZXQgaTtcblxuICAgICAgICBmb3IgKGk9MTsgaSA8PSAocm93cypjb2x1bW5zKS8yOyBpKyspIHtcbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICAgICAgYXJyLnB1c2goaSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0ICBpID0gYXJyLmxlbmd0aC0xOyBpID4gMDsgaS0tKXtcblxuICAgICAgICAgICAgbGV0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIGxldCB0ZW1wID0gYXJyW2ldO1xuICAgICAgICAgICAgYXJyW2ldID0gYXJyW2pdO1xuICAgICAgICAgICAgYXJyW2pdID0gdGVtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnI7XG5cbiAgICB9XG5cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTExLlxuICovXG5jb25zdCBhcHBsaWNhdGlvbnMgPSByZXF1aXJlKCcuLi9hcHBsaWNhdGlvbi9pbmRleCcpO1xuY29uc3QgbWVtb3J5R2FtZSA9IHJlcXVpcmUoJy4uL2FwcGxpY2F0aW9uL21lbW9yeWdhbWUvbWVtb3J5R2FtZScpO1xuY29uc3QgY2hhdCA9IHJlcXVpcmUoJy4uL2FwcGxpY2F0aW9uL2NoYXQvY2hhdEFwcCcpO1xuY29uc3QgZHJhdyA9IHJlcXVpcmUoJy4uL2FwcGxpY2F0aW9uL2RyYXdJdC9kcmF3SXQnKTtcblxubGV0IGluZGV4ID0gMDtcbmxldCBzdGFydFBvc2l0aW9uVG9wID0gMTAwO1xubGV0IHN0YXJ0UG9zaXRpb25MZWZ0ID0gMTAwO1xuXG5jbGFzcyBBcHBsaWNhdGlvbk1hbmFnZXIge1xuICAgIGdldEFwcGxpY2F0aW9uRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIGFwcGxpY2F0aW9ucy5tYXAoYXBwID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7bmFtZTogYXBwLmdldE5hbWUoKX1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5sZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVtcGxhdGUnKSxcbiAgICBlbGVtZW50O1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24gYmVmb3JlQ3JlYXRlKCkge1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBpbWdUYWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaSA+IGltZycpO1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoaW1nVGFnLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBjcmVhdGVXaW5kb3coKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKXtcblxuICAgIGxldCBjbG9uZWROb2RlID0gZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgY2xvbmVkTm9kZS5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoJ2lkJywgaW5kZXgudG9TdHJpbmcoKSk7XG4gICAgbGV0IHBvc2l0aW9uID0gY2xvbmVkTm9kZS5nZXRFbGVtZW50QnlJZChpbmRleC50b1N0cmluZygpKTtcblxuICAgIGlmKCFjaGVja0lmRWxlbWVudElzSW5zaWRlQm9keShwb3NpdGlvbikpe1xuICAgICAgICBzdGFydFBvc2l0aW9uVG9wID0gMTA7XG4gICAgICAgIHN0YXJ0UG9zaXRpb25MZWZ0ICs9IDEwMDtcbiAgICB9XG5cbiAgICBwb3NpdGlvbi5zdHlsZS50b3AgPSBzdGFydFBvc2l0aW9uVG9wICsgJ3B4JztcbiAgICBwb3NpdGlvbi5zdHlsZS5sZWZ0ID0gc3RhcnRQb3NpdGlvbkxlZnQgKyAncHgnO1xuXG4gICAgc3RhcnRQb3NpdGlvblRvcCArPSAxMDtcbiAgICBzdGFydFBvc2l0aW9uTGVmdCArPSAxMDtcblxuICAgIHBvc2l0aW9uLnN0eWxlLnpJbmRleCA9ICgxMDAwICsgaW5kZXgpO1xuXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3aW5kb3ctcG9zaXRpb24nKTtcblxuICAgIGRpdi5hcHBlbmRDaGlsZChjbG9uZWROb2RlKTtcblxuICAgIGlmKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21lbW9yeScpKSB7XG4gICAgICAgIHBvc2l0aW9uLnN0eWxlLndpZHRoID0gMzAwICsgJ3B4JztcbiAgICAgICAgcG9zaXRpb24uc3R5bGUuaGVpZ2h0ID0gMzIwICsgJ3B4JztcbiAgICAgICAgbmV3IG1lbW9yeUdhbWUoNCw0LGluZGV4KTtcbiAgICB9XG5cbiAgICBlbHNlIGlmKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NoYXQnKSl7XG4gICAgICAgIG5ldyBjaGF0KGluZGV4KTtcblxuICAgIH1cblxuICAgIGVsc2UgaWYoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnZHJhdycpKXtcbiAgICAgICAgcG9zaXRpb24uc3R5bGUud2lkdGggPSA2MDAgKyAncHgnO1xuICAgICAgICBwb3NpdGlvbi5zdHlsZS5oZWlnaHQgPSA2MDAgKyAncHgnO1xuICAgICAgICBuZXcgZHJhdyhpbmRleCk7XG5cbiAgICB9XG5cbiAgICBpbmRleCsrO1xuICAgIGNvbmZpZ3VyZVdpbmRvdygpO1xufVxuXG5mdW5jdGlvbiBjb25maWd1cmVXaW5kb3coKSB7XG5cbiAgICB3aW5kb3cub25sb2FkID0gYWRkTGlzdGVuZXJzKCk7XG4gICAgbGV0IG9mZlg7XG4gICAgbGV0IG9mZlk7XG5cbiAgICBsZXQgYWxsTm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2luZG93LXVpJyk7XG4gICAgdmFyIHByZXYgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYWxsTm9kZXNbaV0ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgICAgICAgcHJldi5zdHlsZS56SW5kZXggPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdHlsZS56SW5kZXggPSAxMDAwO1xuICAgICAgICAgICAgcHJldiA9IHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBtb3VzZURvd24sIGZhbHNlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwLCBmYWxzZSk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3VzZVVwKCkge1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZGl2TW92ZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW91c2VEb3duKGUpIHtcblxuICAgICAgICBsZXQgZGl2O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGkudG9TdHJpbmcoKSkuaWQgPT0gZS50YXJnZXQuaWQpIHtcbiAgICAgICAgICAgICAgICBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIG9mZlkgPSBlLmNsaWVudFkgLSBwYXJzZUludChkaXYub2Zmc2V0VG9wKTtcbiAgICAgICAgICAgICAgICBvZmZYID0gZS5jbGllbnRYIC0gcGFyc2VJbnQoZGl2Lm9mZnNldExlZnQpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkaXZNb3ZlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpdk1vdmUoZSkge1xuXG4gICAgICAgIGxldCBkaXY7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxOb2Rlcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaS50b1N0cmluZygpKS5pZCA9PSBlLnRhcmdldC5pZCkge1xuICAgICAgICAgICAgICAgIGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGkudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICAgICAgICBkaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgIGRpdi5zdHlsZS50b3AgPSAoZS5jbGllbnRZIC0gb2ZmWSkgKyAncHgnO1xuICAgICAgICAgICAgICAgIGRpdi5zdHlsZS5sZWZ0ID0gKGUuY2xpZW50WCAtIG9mZlgpICsgJ3B4JztcblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBhbGxOb2Rlc1tpXS5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZC5vbmNsaWNrID0gZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICAgICBpZiAocHJldikge1xuICAgICAgICAgICAgICAgIGFsbE5vZGVzW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb25Ub3AgLT0gMTA7XG4gICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvbkxlZnQgLT0gMTA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gY2hlY2tJZkVsZW1lbnRJc0luc2lkZUJvZHkoKSB7XG5cbiAgICByZXR1cm4gc3RhcnRQb3NpdGlvblRvcCA8IHdpbmRvdy5pbm5lckhlaWdodDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBsaWNhdGlvbk1hbmFnZXI7XG5cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ3JlYXRlZCBieSBla2Vyb3Qgb24gMjAxNi0xMC0xMS5cbiAqL1xuXG5mdW5jdGlvbiB0aW1lKCkge1xuICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IGhvdXIgPSB0b2RheS5nZXRIb3VycygpO1xuICAgIGxldCBtaW51dGVzID0gdG9kYXkuZ2V0TWludXRlcygpO1xuXG4gICAgbWludXRlcyA9IGNoZWNrVGltZShtaW51dGVzKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRpbWVcIikuaW5uZXJIVE1MID0gaG91ciArICc6JyArIG1pbnV0ZXM7XG4gICAgc2V0VGltZW91dCh0aW1lLCA1MDApO1xufVxuXG5mdW5jdGlvbiBjaGVja1RpbWUoaSkge1xuICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgaSA9ICcwJyArIGlcbiAgICB9O1xuICAgIHJldHVybiBpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5jbG9jayA9IHRpbWU7XG4iXX0=
