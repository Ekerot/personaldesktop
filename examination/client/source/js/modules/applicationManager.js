"use strict";

/**
 * Created by ekerot on 2016-10-11.
 */

const applications = require('../application/index');

class ApplicationManager
{
    getApplicationData(){
        return applications.map(app => {
            return {name: app.getName(), trayIcon: app.getTrayIcon()}
        });
    }

    function trayIconClick (e){
    const appName = e.target.data("appName");
    applications.forEach(app =>{

    })
}
module.exports = ApplicationManager;
