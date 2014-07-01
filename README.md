select-shell
===============

list of select for nodejs on terminal.

###Install
```
  $ npm install select-shell
```

###Using

Navigate with arrows

**Up and Down** - Navigates on the options<br/>
**Right** - Check the option<br/>
**Left** - Uncheck the option<br/>
**Enter/Return** - confirms the options selected<br/>
**Esc** - Cancel/Exit<br/>

###Code
``` 

'use strict';

var selectShell = require('./index');
var stream = process.stdin;
var select = selectShell();

/* 
  select.option(text, value)
  Value is optinal. The default value is equal the text.
*/
select.option('One', 1)
      .option('Two', 2)
      .option('Three', 3)
      .select();

select.on('select', function(options){
  /* Return the options selected. Ex.: [{ text: '', value: '' }] or { text: '', value: '' } depends the config multiSelect */
  console.log(options);
  process.exit(0);
});

select.on('cancel', function(options){
  /* Return the options selected. Ex.: [{ text: '', value: '' }] or { text: '', value: '' } depends the config multiSelect */
  console.log('Cancel select, '+ options.length +' options selected');
  process.exit(0);
});
```

###Optional configs
```
var select = require('select-shell)(
  /* Default values */
  {
    pointer: '> ',
    pointerColor: 'white',
    checked: ' ✓',
    checkedColor: 'green',
    msgCancel: 'No selected options!',
    msgCancelColor: 'red',
    multiSelect: true
  }
);
```
###The scheme of color is equal to the module [colors](https://github.com/Marak/colors.js "module colors").

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