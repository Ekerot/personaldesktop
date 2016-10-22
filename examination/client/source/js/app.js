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
        let a = document.createElement('a');
        let imgTag = document.createElement('img');
        imgTag.setAttribute('src', '/image/' + appData.name + ".png");
        imgTag.setAttribute('class', appData.name);
        imgTag.appendChild(a);
        list.appendChild(imgTag);
        fragment.appendChild(list);

    });
    ul.appendChild(fragment);
}



