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


