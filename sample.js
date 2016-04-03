'use strict';

var list = require('./index')(
  /* possible configs */
  {
    pointer: ' ▸ ',
    pointerColor: 'yellow',
    checked: ' ◉  ',
    unchecked:' ◎  ',
    checkedColor: 'blue',
    msgCancel: '',
    multiSelect: true,
    inverse: true,
    prepend: true
  }
);

var stream = process.stdin;

list.option(' One    ')
    .option(' Two    ')
    .option(' Three  ')
    .list();

list.on('select', function(options){
  console.log('select', options);
  process.exit(0);
});

list.on('cancel', function(options){
  console.log('Cancel list, '+ options.length +' options selected');
  process.exit(0);
});
