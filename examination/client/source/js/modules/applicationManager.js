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
