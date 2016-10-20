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
        let imgTag = document.createElement('img');
        imgTag.setAttribute('src', '/image/' + appData.name + ".png");
        imgTag.setAttribute('class', appData.name);
        list.appendChild(imgTag);
        fragment.appendChild(list);

    });
    ul.appendChild(fragment);
}




},{"./modules/applicationManager":6,"./modules/clock":7}],2:[function(require,module,exports){
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
/**
 * Created by ekerot on 2016-10-11.
 */

const ChatApp  = require('./chat/chat');

const Memory = require('./memorygame/memory');

module.exports = [
    new ChatApp(),
    new Memory()
];

},{"./chat/chat":2,"./memorygame/memory":4}],4:[function(require,module,exports){
"use strict";

/**
 * Created by ekerot on 2016-10-11.
 */

class Memory {

    getName() {
        return 'Memory';
    }

    getTrayIcon() {
        return {
            icon: "/image/memoryicon.png"
        }

    }
}
module.exports = Memory;



},{}],5:[function(require,module,exports){
/**
 * Created by ekerot on 2016-10-19.
 */

module.exports = function(rows, columns) {
    let i;
    let a;
    let tiles = [];
    let turn1;
    let turn2;
    let lastTile;
    let tries = 0;
    let pairs = 0;

    tiles = getPicture(rows,columns)

    let container = document.getElementById('application');

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

},{}],6:[function(require,module,exports){
"use strict";

/**
 * Created by ekerot on 2016-10-11.
 */
const applications = require('../application/index');
const memoryGame = require('../application/memorygame/memoryGame');

class ApplicationManager {
    getApplicationData() {
        return applications.map(app => {
            return {name: app.getName()}
        });
    }
}

const container = document.getElementById('window-position');
const template = document.getElementById('template');

window.onload = function createWindow() {
    let imgTag = document.querySelectorAll('li > img');
    Array.prototype.forEach.call(imgTag, function (node) {
        node.addEventListener('click', function (event) {
            let element = document.cloneNode(template.content)
            container.appendChild(element);

            if(event.target.classList.contains('Memory')){
                new memoryGame(4,4);
            }

            console.log(event.target)
            console.log("Du klickade")

            closeWindow();
        });
    });
};

function closeWindow(node){
    let windowbutton = document.querySelector('.btn');
    windowbutton.addEventListener('click', function(){

        document.body.removeChild(document.querySelector('.window-ui'))
        console.log('klick,klick');

    })


}

module.exports = ApplicationManager;

},{"../application/index":3,"../application/memorygame/memoryGame":5}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuNy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBsaWNhdGlvbi9jaGF0L2NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcGxpY2F0aW9uL2luZGV4LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBsaWNhdGlvbi9tZW1vcnlnYW1lL21lbW9yeS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwbGljYXRpb24vbWVtb3J5Z2FtZS9tZW1vcnlHYW1lLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb2R1bGVzL2FwcGxpY2F0aW9uTWFuYWdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbW9kdWxlcy9jbG9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgY2xvY2sgPSByZXF1aXJlKCcuL21vZHVsZXMvY2xvY2snKTtcbmNvbnN0IEFwcGxpY2F0aW9uTWFuYWdlciA9IHJlcXVpcmUoJy4vbW9kdWxlcy9hcHBsaWNhdGlvbk1hbmFnZXInKVxuXG5sZXQgYXBwbGljYWl0b25NYW5hZ2VyID0gbmV3IEFwcGxpY2F0aW9uTWFuYWdlcigpO1xuXG5jbG9jay5jbG9jaygpO1xuYXBwZW5kSWNvbigpO1xuXG5mdW5jdGlvbiBhcHBlbmRJY29uKCl7XG4gICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGxldCB1bCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlzdCcpXG5cbiAgICBhcHBsaWNhaXRvbk1hbmFnZXIuZ2V0QXBwbGljYXRpb25EYXRhKCkuZm9yRWFjaChhcHBEYXRhID0+e1xuXG4gICAgICAgIGxldCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGV0IGltZ1RhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBpbWdUYWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlLycgKyBhcHBEYXRhLm5hbWUgKyBcIi5wbmdcIik7XG4gICAgICAgIGltZ1RhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYXBwRGF0YS5uYW1lKTtcbiAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChpbWdUYWcpO1xuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChsaXN0KTtcblxuICAgIH0pO1xuICAgIHVsLmFwcGVuZENoaWxkKGZyYWdtZW50KTtcbn1cblxuXG5cbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMTEuXG4gKi9cblxuY2xhc3MgQ2hhdEFwcCB7XG5cbiAgICAvLyBjb25zdHJ1Y3Rvcigpe1xuICAgIC8vICAgIHRoaXMuY2xpZW50ID0gbmV3IFNvY2tldENsaWVuXG4gICAgLy8gfVxuXG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdjaGF0JztcbiAgICB9XG5cbiAgICAvKiAgICBvbkNyZWF0ZSgpe1xuICAgICB0aGlzLmNsaWVudC5jb25uZWN0KCk7XG4gICAgIGNvbnN0IGh0bWxFbGVtZW50ID0gdmlldy5pbml0aWFsUmVuZGVyKCk7XG4gICAgIHJldHVybiBodG1sRWxlbWVudDtcbiAgICAgfVxuXG4gICAgIC8vb25SZWFkeSgpXG4gICAgIC8vY29ubmVjdFxuXG4gICAgIHJlbmRlcigpe1xuICAgICByZXR1cm4gdmlldy5nZXRJbml0aWFsUmVuZGVyKCk7XG4gICAgIH1cblxuICAgICAvL29uQ2xvc2UoKVxuICAgICAvL3RoaXMuY2xpZW50LiovXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdEFwcDtcblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTExLlxuICovXG5cbmNvbnN0IENoYXRBcHAgID0gcmVxdWlyZSgnLi9jaGF0L2NoYXQnKTtcblxuY29uc3QgTWVtb3J5ID0gcmVxdWlyZSgnLi9tZW1vcnlnYW1lL21lbW9yeScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgICBuZXcgQ2hhdEFwcCgpLFxuICAgIG5ldyBNZW1vcnkoKVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMTEuXG4gKi9cblxuY2xhc3MgTWVtb3J5IHtcblxuICAgIGdldE5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnTWVtb3J5JztcbiAgICB9XG5cbiAgICBnZXRUcmF5SWNvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGljb246IFwiL2ltYWdlL21lbW9yeWljb24ucG5nXCJcbiAgICAgICAgfVxuXG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG5cblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTE5LlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocm93cywgY29sdW1ucykge1xuICAgIGxldCBpO1xuICAgIGxldCBhO1xuICAgIGxldCB0aWxlcyA9IFtdO1xuICAgIGxldCB0dXJuMTtcbiAgICBsZXQgdHVybjI7XG4gICAgbGV0IGxhc3RUaWxlO1xuICAgIGxldCB0cmllcyA9IDA7XG4gICAgbGV0IHBhaXJzID0gMDtcblxuICAgIHRpbGVzID0gZ2V0UGljdHVyZShyb3dzLGNvbHVtbnMpXG5cbiAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcGxpY2F0aW9uJyk7XG5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjbWVtb3J5LWNvbnRhaW5lcicpWzBdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICB0aWxlcy5mb3JFYWNoKGZ1bmN0aW9uKHRpbGUsIGluZGV4KSB7XG5cbiAgICAgICAgYSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhKTtcblxuICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIGxldCBpbWcgPSBldmVudC50YXJnZXQubm9kZU5hbWUgPT09ICdJTUcnID8gZXZlbnQudGFyZ2V0IDogZXZlbnQudGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgICAgICAgICB0dXJuVGlsZSh0aWxlLGluZGV4LGltZylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKChpICsgMSkgJSBjb2x1bW5zID09PSAwKSB7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHR1cm5UaWxlKHRpbGUsaW5kZXgsIGVsZW1lbnQpe1xuXG4gICAgICAgIGlmKHR1cm4yKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC5zcmM9XCJpbWFnZS9tZW1vcnlpbWFnZXMvXCIrdGlsZStcIi5wbmdcIjtcblxuICAgICAgICBpZiAoIXR1cm4xKXtcbiAgICAgICAgICAgIHR1cm4xID0gZWxlbWVudDtcbiAgICAgICAgICAgIGxhc3RUaWxlID0gdGlsZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB0dXJuMiA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB0cmllcyArPSAxO1xuXG4gICAgICAgICAgICBpZihlbGVtZW50ID09PSB0dXJuMSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihsYXN0VGlsZSA9PT0gdGlsZSl7XG4gICAgICAgICAgICAgICAgdHVybjEucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdyZW1vdmVkJyk7XG4gICAgICAgICAgICAgICAgdHVybjIucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdyZW1vdmVkJyk7XG4gICAgICAgICAgICAgICAgcGFpcnMgKz0gMTtcbiAgICAgICAgICAgICAgICB0dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdHVybjIgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmKHBhaXJzID09PSAoY29sdW1ucypyb3dzKS8yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1lvdSB3b24gYXQgJyArIHRyaWVzICsgJyB0cmllcyEnKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLnRleHRDb250ZW50ID0gJ1lvdSB3b24gYXQgJyArIHRyaWVzICsgJyB0cmllcyEnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB0dXJuMS5zcmMgPSAnL2ltYWdlL21lbW9yeWltYWdlcy8wLnBuZydcbiAgICAgICAgICAgICAgICAgICAgdHVybjIuc3JjID0gJy9pbWFnZS9tZW1vcnlpbWFnZXMvMC5wbmcnXG4gICAgICAgICAgICAgICAgICAgIHR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdHVybjIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sIDIwMClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGljdHVyZShyb3dzLCBjb2x1bW5zKXtcblxuICAgICAgICBsZXQgYXJyID0gW107XG4gICAgICAgIGxldCBpO1xuXG4gICAgICAgIGZvciAoaT0xOyBpIDw9IChyb3dzKmNvbHVtbnMpLzI7IGkrKykge1xuICAgICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgICAgICBhcnIucHVzaChpKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgIGkgPSBhcnIubGVuZ3RoLTE7IGkgPiAwOyBpLS0pe1xuXG4gICAgICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAgICAgbGV0IHRlbXAgPSBhcnJbaV07XG4gICAgICAgICAgICBhcnJbaV0gPSBhcnJbal07XG4gICAgICAgICAgICBhcnJbal0gPSB0ZW1wO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycjtcblxuICAgIH1cblxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ3JlYXRlZCBieSBla2Vyb3Qgb24gMjAxNi0xMC0xMS5cbiAqL1xuY29uc3QgYXBwbGljYXRpb25zID0gcmVxdWlyZSgnLi4vYXBwbGljYXRpb24vaW5kZXgnKTtcbmNvbnN0IG1lbW9yeUdhbWUgPSByZXF1aXJlKCcuLi9hcHBsaWNhdGlvbi9tZW1vcnlnYW1lL21lbW9yeUdhbWUnKTtcblxuY2xhc3MgQXBwbGljYXRpb25NYW5hZ2VyIHtcbiAgICBnZXRBcHBsaWNhdGlvbkRhdGEoKSB7XG4gICAgICAgIHJldHVybiBhcHBsaWNhdGlvbnMubWFwKGFwcCA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge25hbWU6IGFwcC5nZXROYW1lKCl9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpbmRvdy1wb3NpdGlvbicpO1xuY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVtcGxhdGUnKTtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpIHtcbiAgICBsZXQgaW1nVGFnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGkgPiBpbWcnKTtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGltZ1RhZywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jbG9uZU5vZGUodGVtcGxhdGUuY29udGVudClcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtZW50KTtcblxuICAgICAgICAgICAgaWYoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnTWVtb3J5Jykpe1xuICAgICAgICAgICAgICAgIG5ldyBtZW1vcnlHYW1lKDQsNCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRHUga2xpY2thZGVcIilcblxuICAgICAgICAgICAgY2xvc2VXaW5kb3coKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBjbG9zZVdpbmRvdyhub2RlKXtcbiAgICBsZXQgd2luZG93YnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bicpO1xuICAgIHdpbmRvd2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2luZG93LXVpJykpXG4gICAgICAgIGNvbnNvbGUubG9nKCdrbGljayxrbGljaycpO1xuXG4gICAgfSlcblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwbGljYXRpb25NYW5hZ2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ3JlYXRlZCBieSBla2Vyb3Qgb24gMjAxNi0xMC0xMS5cbiAqL1xuXG5mdW5jdGlvbiB0aW1lKCkge1xuICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IGhvdXIgPSB0b2RheS5nZXRIb3VycygpO1xuICAgIGxldCBtaW51dGVzID0gdG9kYXkuZ2V0TWludXRlcygpO1xuXG4gICAgbWludXRlcyA9IGNoZWNrVGltZShtaW51dGVzKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRpbWVcIikuaW5uZXJIVE1MID0gaG91ciArICc6JyArIG1pbnV0ZXM7XG4gICAgc2V0VGltZW91dCh0aW1lLCA1MDApO1xufVxuXG5mdW5jdGlvbiBjaGVja1RpbWUoaSkge1xuICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgaSA9ICcwJyArIGlcbiAgICB9O1xuICAgIHJldHVybiBpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5jbG9jayA9IHRpbWU7XG4iXX0=
