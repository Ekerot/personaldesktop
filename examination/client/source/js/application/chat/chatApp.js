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
