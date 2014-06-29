'use strict';

var list = require('./index')();
var stream = process.stdin;

list.option('One')
    .option('Two')
    .option('Three')
    .list();

list.event.on('select', function(options){
  console.log(options);
  process.exit(0);
});

list.event.on('cancel', function(options){
  console.log('Cancel list, '+ options.length +' options selected');
  process.exit(0);
});