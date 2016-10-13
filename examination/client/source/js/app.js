let clock = require('./modules/clock');

clock.clock();

const ApplicationManager = require('./modules/applicationManager')

let applicaitonManager = new ApplicationManager();

appendIcon();

function appendIcon(){
    let fragment = document.createDocumentFragment();
    let ul = document.querySelector('.nav-list')

    applicaitonManager.getApplicationData().forEach(appData =>{

        let list = document.createElement('li');
        let aTag = document.createElement('a');
        let imgTag = document.createElement('img');
        imgTag.setAttribute('src', '/image/memoryicon.png');
        list.appendChild(imgTag);
        list.appendChild(aTag);
        fragment.appendChild(list);

    });
    ul.appendChild(fragment);
}
