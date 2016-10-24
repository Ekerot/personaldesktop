/**
 * Created by ekerot on 2016-10-24.
 */

module.exports = function(index) {

    document.getElementById('application').setAttribute('id', 'application' + index);
    let container = document.querySelector('#application' + index);
    let template = document.querySelectorAll('#draw-container')[0].content;
    let drawingArea = document.importNode(template, true);
    let controls = Object.create(null);
    let tools = Object.create(null);

    container.appendChild(drawingArea);

    document.getElementById(index).appendChild(container);

    let parent = document.getElementById('application'+ index);

    function createDraw(parent){

        let canvas = helper('canvas', {width: 595, height: 500});
        let cx = canvas.getContext('2d');
        let toolbar = helper('div', {class: 'toolbar'});
        for (let name in controls){
            toolbar.appendChild(controls[name](cx));
        }

        let panel = helper('div', {class: 'picturepanel'}, canvas);
        parent.appendChild(helper('div', null, panel, toolbar));
    }

    controls.tool = function(cx) {
        let select = helper('select');
        for(let name in tools){
            select.appendChild(helper('option', null, name));
        }

        cx.canvas.addEventListener('mousedown', function (e) {
            if (e.which == 1) {
                tools[select.value](e, cx);
                e.preventDefault();
            }
        });

        return helper('div', null, 'Tool: ', select);
    };

    function relativPosition(e, element){
        let rectangle = element.getBoundingClientRect();

        return {x: Math.floor(e.clientX - rectangle.left)},
        {y: Math.floor(e.clientY - rectangle.top)};
    }

    function trackDrag(onMove, onEnd) {

        function end(e) {
            removeEventListener('mousemove', onMove);
            removeEventListener('mouseup', end);

            if (onEnd) {
                onEnd(e);
            }
            addEventListener('mousemove', onMove);
            addEventListener('mouseup', end);
        }
    }

    tools.Line = function(e, cx, onEnd) {
        cx.lineCap = 'round';

        console.log(e, cx)

        let pos = relativPosition(e, cx.canvas);

        trackDrag(function(event)
        {
            cx.beginPath();
            console.log(cx.moveTo(pos.x, pos.y))
            cx.moveTo(pos.x, pos.y);
            pos = relativPosition(event, cx.canvas);
            cx.lineTo(pos.x, pos.y);
            cx.stroke();
        }, onEnd);

    };

    tools.Erase = function(e, cx){
        cx.globalCompositeOperation = 'destination-out';
        tools.Line(e, cx, function(){
            cx.globalCompositeOperation = 'source-over';
        });
    };

    controls.color = function(cx){
        let input = helper('input', {type: 'color'});
        input.addEventListener('change', function(){
            cx.fillStyle = input.value;
            cx.strokeStyle = input.value;
        });
        return helper('div', null, 'Color: ', input);
    };

    controls.brushSize = function(cx){
        let select = helper('select');
        let size = [1,2,3,5,8,12,25,35,50,75,100];

        size.forEach(function(pixels){
            select.appendChild(helper('option', {value: pixels}, pixels + 'pixels'));
        });

        select.addEventListener('change', function(){
            cx.lineWidth = select.value;
        });
        return helper('div', null, 'Brush size: ', select);
    };

    function helper(name, attributes) {

        let node = document.createElement(name);

        if (attributes) {
            for (let attr in attributes) {
                if (attributes.hasOwnProperty(attr)) {
                    node.setAttribute(attr, attributes[attr]);
                }
            }
        }

        for (let i = 2; i < arguments.length; i += 1) {
            let child = arguments[i];
            if (typeof child == 'string') {
                child = document.createTextNode(child);
            }

            node.appendChild(child);
        }

        return node;
    }

    createDraw(parent);

};
