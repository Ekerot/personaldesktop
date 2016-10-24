'use strict';

/**
 * Created by ekerot on 2016-10-19.
 */

module.exports = function(rows, columns, index) {
    let i;
    let a;
    let tiles = [];
    let turn1;
    let turn2;
    let lastTile;
    let tries = 0;
    let pairs = 0;

    tiles = getPicture(rows,columns)

    document.getElementById('application').setAttribute('id', 'application' + index);
    let container = document.querySelector('#application'+ index);
    let template = document.querySelectorAll('#memory-container')[0].content.firstElementChild;

    tiles.forEach(function(tile, index) {

        a = document.importNode(template, true);

        container.appendChild(a);

        a.addEventListener('click', function (event) {

            let img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild;

            turnTile(tile,index,img)
        });

        if ((i + 1) % columns === 0) {
            container.appendChild(document.createElement('br'));
        }
    });

    function turnTile(tile,index, element){

        if(turn2){
            return;
        }
            element.src="image/memoryimages/"+tile+".png";

        if (!turn1){
            turn1 = element;
            lastTile = tile;
            return;
        }

        else{
            turn2 = element;
            tries += 1;

            if(element === turn1){
                return;
            }

            if(lastTile === tile){
                turn1.parentNode.classList.add('removed');
                turn2.parentNode.classList.add('removed');
                pairs += 1;
                turn1 = null;
                turn2 = null;
                if(pairs === (columns*rows)/2){
                    console.log('You won at ' + tries + ' tries!');
                    container.textContent = 'You won at ' + tries + ' tries!';
                }

                return;
            }

            else{
                window.setTimeout(function(){
                    turn1.src = '/image/memoryimages/0.png'
                    turn2.src = '/image/memoryimages/0.png'
                    turn1 = null;
                    turn2 = null;
                }, 200)
            }

        }
    }

    function getPicture(rows, columns){

        let arr = [];
        let i;

        for (i=1; i <= (rows*columns)/2; i++) {
            arr.push(i);
            arr.push(i);

        }

        for (let  i = arr.length-1; i > 0; i--){

            let j = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        return arr;

    }

}





