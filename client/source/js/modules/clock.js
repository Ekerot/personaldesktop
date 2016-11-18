"use strict";

/**
 * Created by ekerot on 2016-10-11.
 */

function time() {
    let today = new Date();
    let hour = today.getHours();
    let minutes = today.getMinutes();

    minutes = checkTime(minutes);
    document.querySelector(".time").innerHTML = hour + ':' + minutes;
    setTimeout(time, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = '0' + i
    };
    return i;
}

module.exports.clock = time;
