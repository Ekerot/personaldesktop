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

