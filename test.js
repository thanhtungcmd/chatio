var Filter = require('bad-words'),
    filter = new Filter();
console.log('xxxx');

var newBadWords = ['lozi', 'bigcoin', 'big coin'];
filter.addWords(...newBadWords);
 
console.log(filter.clean("lozi bigcoin word!"))