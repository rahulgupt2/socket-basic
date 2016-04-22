var moment = require('moment');
var now = moment();

console.log(now.format());
//2016-04-21T10:57:50+05:30
// less prices
console.log(now.format('X'));
//1461216470
//more presice
console.log(now.format('x'));
//1461216470179
console.log(now.valueOf());
//1461216470179


var timestamp = now.valueOf();
var timestampMoment = moment.utc(timestamp);
console.log(timestampMoment.local().format('h:mm a'));




now.subtract(1, 'year');
console.log(now.format());
//2015-04-21T10:57:50+05:30
console.log(now.format('MMM Do YYYY, h:mma'));
//Apr 21st 2015, 10:57am






