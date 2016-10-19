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
        imgTag.setAttribute('src', '/image/chaticon.png');
        imgTag.setAttribute('class', appData.name);
        list.appendChild(imgTag);
        fragment.appendChild(list);

    });
    ul.appendChild(fragment);
}


},{"./modules/applicationManager":5,"./modules/clock":6}],2:[function(require,module,exports){
"use strict";

/**
 * Created by ekerot on 2016-10-11.
 */

class ChatApp {

    // constructor(){
    //    this.client = new SocketClien
    // }

    getName() {
        return 'Chat';
    }

    getTrayIcon() {
        return {
            icon: '/image/chaticon.png'
        }

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

const Memory = require('./memory');

module.exports = [
    new ChatApp(),
    new Memory()
];

},{"./chat/chat":2,"./memory":4}],4:[function(require,module,exports){
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
"use strict";

/**
 * Created by ekerot on 2016-10-11.
 */

const applications = require('../application/index');

class ApplicationManager {
    getApplicationData() {
        return applications.map(app => {
            return {name: app.getName(), trayIcon: app.getTrayIcon()}
        });
    }
}

const template = document.querySelector('#windows-position'),
    windowTemplate = document.querySelector('.template'),
    firstElement = document.importNode(windowTemplate.content.firstElementChild, true);

window.onload = function createWindow() {
    let imgTag = document.querySelectorAll('li > img');
    Array.prototype.forEach.call(imgTag, function(node) {
        node.addEventListener('click', function () {

            document.body.appendChild(firstElement);

        });
    });

    let x_pos = 0,
        y_pos = 0;
    let windowUi = document.getElementsByClassName('frame');
    window.onload = addListeners();

    function addListeners() {
        window.addEventListener('mousedown', mouseDown, false);
        window.addEventListener('mouseup', mouseUp, false);
    }

    function mouseUp() {
        window.removeEventListener('mousemove', divMove, true);
    }

    function mouseDown(e) {
        let div = document.getElementsByClassName('frame');
        x_pos = e.clientX - div.offsetLeft;
        y_pos = e.clientY - div.offsetTop;
        window.addEventListener('mousemove', divMove, true);
    }

    function divMove(e) {
        let div = document.getElementsByClassName('frame');
        div.style.position = 'absolute';
        div.style.top = (e.clientY - y_pos) + 'px';
        div.style.left = (e.clientX - x_pos) + 'px';
    }

}

module.exports = ApplicationManager;

},{"../application/index":3}],6:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuNy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBsaWNhdGlvbi9jaGF0L2NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcGxpY2F0aW9uL2luZGV4LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHBsaWNhdGlvbi9tZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL21vZHVsZXMvYXBwbGljYXRpb25NYW5hZ2VyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb2R1bGVzL2Nsb2NrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgY2xvY2sgPSByZXF1aXJlKCcuL21vZHVsZXMvY2xvY2snKTtcbmNvbnN0IEFwcGxpY2F0aW9uTWFuYWdlciA9IHJlcXVpcmUoJy4vbW9kdWxlcy9hcHBsaWNhdGlvbk1hbmFnZXInKVxuXG5sZXQgYXBwbGljYWl0b25NYW5hZ2VyID0gbmV3IEFwcGxpY2F0aW9uTWFuYWdlcigpO1xuXG5jbG9jay5jbG9jaygpO1xuYXBwZW5kSWNvbigpO1xuXG5mdW5jdGlvbiBhcHBlbmRJY29uKCl7XG4gICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGxldCB1bCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbGlzdCcpXG5cbiAgICBhcHBsaWNhaXRvbk1hbmFnZXIuZ2V0QXBwbGljYXRpb25EYXRhKCkuZm9yRWFjaChhcHBEYXRhID0+e1xuXG4gICAgICAgIGxldCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGV0IGltZ1RhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBpbWdUYWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL2NoYXRpY29uLnBuZycpO1xuICAgICAgICBpbWdUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsIGFwcERhdGEubmFtZSk7XG4gICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaW1nVGFnKTtcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQobGlzdCk7XG5cbiAgICB9KTtcbiAgICB1bC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgZWtlcm90IG9uIDIwMTYtMTAtMTEuXG4gKi9cblxuY2xhc3MgQ2hhdEFwcCB7XG5cbiAgICAvLyBjb25zdHJ1Y3Rvcigpe1xuICAgIC8vICAgIHRoaXMuY2xpZW50ID0gbmV3IFNvY2tldENsaWVuXG4gICAgLy8gfVxuXG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdDaGF0JztcbiAgICB9XG5cbiAgICBnZXRUcmF5SWNvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGljb246ICcvaW1hZ2UvY2hhdGljb24ucG5nJ1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKiAgICBvbkNyZWF0ZSgpe1xuICAgICB0aGlzLmNsaWVudC5jb25uZWN0KCk7XG4gICAgIGNvbnN0IGh0bWxFbGVtZW50ID0gdmlldy5pbml0aWFsUmVuZGVyKCk7XG4gICAgIHJldHVybiBodG1sRWxlbWVudDtcbiAgICAgfVxuXG4gICAgIC8vb25SZWFkeSgpXG4gICAgIC8vY29ubmVjdFxuXG4gICAgIHJlbmRlcigpe1xuICAgICByZXR1cm4gdmlldy5nZXRJbml0aWFsUmVuZGVyKCk7XG4gICAgIH1cblxuICAgICAvL29uQ2xvc2UoKVxuICAgICAvL3RoaXMuY2xpZW50LiovXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdEFwcDtcblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTExLlxuICovXG5cbmNvbnN0IENoYXRBcHAgID0gcmVxdWlyZSgnLi9jaGF0L2NoYXQnKTtcblxuY29uc3QgTWVtb3J5ID0gcmVxdWlyZSgnLi9tZW1vcnknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBbXG4gICAgbmV3IENoYXRBcHAoKSxcbiAgICBuZXcgTWVtb3J5KClcbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTExLlxuICovXG5cbmNsYXNzIE1lbW9yeSB7XG5cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gJ01lbW9yeSc7XG4gICAgfVxuXG4gICAgZ2V0VHJheUljb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpY29uOiBcIi9pbWFnZS9tZW1vcnlpY29uLnBuZ1wiXG4gICAgICAgIH1cblxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTExLlxuICovXG5cbmNvbnN0IGFwcGxpY2F0aW9ucyA9IHJlcXVpcmUoJy4uL2FwcGxpY2F0aW9uL2luZGV4Jyk7XG5cbmNsYXNzIEFwcGxpY2F0aW9uTWFuYWdlciB7XG4gICAgZ2V0QXBwbGljYXRpb25EYXRhKCkge1xuICAgICAgICByZXR1cm4gYXBwbGljYXRpb25zLm1hcChhcHAgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtuYW1lOiBhcHAuZ2V0TmFtZSgpLCB0cmF5SWNvbjogYXBwLmdldFRyYXlJY29uKCl9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2luZG93cy1wb3NpdGlvbicpLFxuICAgIHdpbmRvd1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlbXBsYXRlJyksXG4gICAgZmlyc3RFbGVtZW50ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh3aW5kb3dUZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpIHtcbiAgICBsZXQgaW1nVGFnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGkgPiBpbWcnKTtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGltZ1RhZywgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZpcnN0RWxlbWVudCk7XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBsZXQgeF9wb3MgPSAwLFxuICAgICAgICB5X3BvcyA9IDA7XG4gICAgbGV0IHdpbmRvd1VpID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZnJhbWUnKTtcbiAgICB3aW5kb3cub25sb2FkID0gYWRkTGlzdGVuZXJzKCk7XG5cbiAgICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBtb3VzZURvd24sIGZhbHNlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW91c2VVcCgpIHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRpdk1vdmUsIHRydWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdXNlRG93bihlKSB7XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmcmFtZScpO1xuICAgICAgICB4X3BvcyA9IGUuY2xpZW50WCAtIGRpdi5vZmZzZXRMZWZ0O1xuICAgICAgICB5X3BvcyA9IGUuY2xpZW50WSAtIGRpdi5vZmZzZXRUb3A7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkaXZNb3ZlLCB0cnVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXZNb3ZlKGUpIHtcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZyYW1lJyk7XG4gICAgICAgIGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGRpdi5zdHlsZS50b3AgPSAoZS5jbGllbnRZIC0geV9wb3MpICsgJ3B4JztcbiAgICAgICAgZGl2LnN0eWxlLmxlZnQgPSAoZS5jbGllbnRYIC0geF9wb3MpICsgJ3B4JztcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBsaWNhdGlvbk1hbmFnZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IGVrZXJvdCBvbiAyMDE2LTEwLTExLlxuICovXG5cbmZ1bmN0aW9uIHRpbWUoKSB7XG4gICAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICBsZXQgaG91ciA9IHRvZGF5LmdldEhvdXJzKCk7XG4gICAgbGV0IG1pbnV0ZXMgPSB0b2RheS5nZXRNaW51dGVzKCk7XG5cbiAgICBtaW51dGVzID0gY2hlY2tUaW1lKG1pbnV0ZXMpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGltZVwiKS5pbm5lckhUTUwgPSBob3VyICsgJzonICsgbWludXRlcztcbiAgICBzZXRUaW1lb3V0KHRpbWUsIDUwMCk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrVGltZShpKSB7XG4gICAgaWYgKGkgPCAxMCkge1xuICAgICAgICBpID0gJzAnICsgaVxuICAgIH07XG4gICAgcmV0dXJuIGk7XG59XG5cbm1vZHVsZS5leHBvcnRzLmNsb2NrID0gdGltZTtcbiJdfQ==
