

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
