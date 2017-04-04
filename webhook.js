var IncomingWebhook = require('@slack/client').IncomingWebhook;
var moment = require('moment');
var config = require('./config.json');
var quotes = require('./templates/quotes.json');
var reminder = require('./templates/reminder.json');
var url = process.env.SLACK_WEBHOOK_URL || ''; //see section above on sensitive data

var webhook = new IncomingWebhook(url);
var now = moment();

var day = function (day) {
switch(day){
    case "Monday": return  1;
    case "Tuesday": return  2;
    case "Wednesday": return  3;
    case "Thursday": return  4;
    case "Friday": return  5;
    case "Saturday": return  7;
    case "Sunday": return  7;
    default: return  5; //Friday by default
}
}(config.delivery_day);

var diff = (now.diff(moment(config.delivery_time, 'hh:mm a'), 'hours'));
var flag = 0;

setInterval(function(){
    if(now.day() === day && diff >= 0 && diff < config.polling_interval_hours){
        if(flag === 0) {
            flag = 1;
            var msg = reminder.message + "\n";
            msg = msg + ">" + (quotes.meeting_reminder[Math.floor(Math.random() * quotes.meeting_reminder.length)].message);
            webhook.send('Hello there! It\'s ' + config.delivery_day + ' already. \n ' + msg, function (err, res) {
                if (err) {
                    console.log('Error:', err);
                } else {
                    console.log('Message sent: ', res);
                }
            });
        }
    }
    else{
        flag = 0;
        console.log("not logging")
    }

}, config.polling_interval_hours*3600*1000);
