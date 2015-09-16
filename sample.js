'use strict';

var list = require('./index')(
  /* Default values */
  {
    pointer: '> ',
    pointerColor: 'red',
    checked: ' ◉  ',
		unchecked: ' ◎  ',
    checkedColor: 'blue',
    msgCancel: 'No selected options!',
    msgCancelColor: 'red',
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
  console.log(options);
  process.exit(0);
});

list.on('cancel', function(options){
  console.log('Cancel list, '+ options.length +' options selected');
  process.exit(0);
});


