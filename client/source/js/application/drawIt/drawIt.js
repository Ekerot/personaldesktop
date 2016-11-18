/**
 * Created by ekerot on 2016-10-24.
 */

module.exports = function(index) {

    document.getElementById('application').setAttribute('id', 'application' + index);
    let container = document.querySelector('#application' + index);
    let template = document.querySelectorAll('#draw-container')[0].content;
    let drawingArea = document.importNode(template, true);

    container.appendChild(drawingArea);

    let canvas = document.createElement('canvas');

    let canvasDiv = document.getElementById('application'+index).lastElementChild.previousElementSibling;
    canvas.setAttribute('class', 'canvas');
    canvas.setAttribute('width', '595px');
    canvas.setAttribute('height', '500px')
    canvasDiv.appendChild(canvas);

    let cx = canvas.getContext('2d');
    let mouse = {x: 0, y: 0};

    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.pageX - canvas.getBoundingClientRect().left;
        mouse.y = e.pageY - canvas.getBoundingClientRect().top;
    });

    setColor();
    setBrushSize()

    canvas.addEventListener('mousedown', function() {
        cx.beginPath();
        cx.moveTo(mouse.x, mouse.y);

        canvas.addEventListener('mousemove', paint, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', paint, false);
    }, false);

    let paint = function() {
        cx.lineTo(mouse.x, mouse.y);
        cx.stroke();
    };


    function setColor(){

        let colorSelector = document.getElementById('setcolor');

        colorSelector.addEventListener('change', function () {

            cx.fillStyle = colorSelector.value
            cx.strokeStyle = colorSelector.value
        })

    }

    function setBrushSize(){

        let brushsize = document.getElementById('brushsize');
        cx.lineCap = 'round';

        brushsize.addEventListener('change', function () {

            cx.lineWidth = brushsize.value;
        })

    }

};
