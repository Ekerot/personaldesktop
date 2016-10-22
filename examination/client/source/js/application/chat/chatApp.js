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
