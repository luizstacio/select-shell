select-shell
===============

list of select for nodejs on terminal.

####Install
```
  $ npm install select-shell
```

####Using
``` 
var select = require('select-shell')();
var stream = process.stdin;

/* 
  select.option(text, value)
  Value is optinal. The default value is equal the text.
*/
select.option('One')
      .option('Two')
      .option('Three')
      .list();

/*
  select.event is the a EventEmitter
*/
select.event.on('select', function(options){
  /* Return the options selected. Ex.: [{ text: '', value: '' }] */
  console.log(options);
  process.exit(0);
});

select.event.on('cancel', function(options){
  /* Return the options selected. Ex.: [{ text: '', value: '' }] */
  console.log('Cancel select, '+ options.length +' options selected');
  process.exit(0);
});
```

####Optional configs
```
var select = require('select-shell)(
  /* Default values */
  {
    pointer: '> ',
    pointerColor: 'white',
    checked: ' ✓',
    checkedColor: 'green',
    msgCancel: 'No selected options!',
    msgCancelColor: 'red'
  },
  /* Stream */
  stream
);
```
#####The scheme of color is equal to the module [colors](https://github.com/Marak/colors.js "module colors").

  - bold
  - italic
  - underline
  - inverse
  - yellow
  - cyan
  - white
  - magenta
  - green
  - red
  - grey
  - blue
  - rainbow
  - zebra
  - random