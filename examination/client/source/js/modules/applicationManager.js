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
