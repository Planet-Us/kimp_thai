
const {sendKimp, getToday} = require('./server.js');
const axios = require('axios');

const schedule = require('node-schedule');


const regularExec = schedule.scheduleJob('0 0 * * * *', async ()=>{ 
    sendKimp();
});