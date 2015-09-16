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

var list = require('./index')(
  /* Default values */
  {
    pointer: ' ▸ ',
    pointerColor: 'yellow',
    checked: ' ◉  ',
    unchecked:' ◎  ',
    checkedColor: 'blue',
    msgCancel: 'No selected options!',
    msgCancelColor: 'orange',
    multiSelect: false,
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
```

![select-shell example image](https://raw.github.com/mralexgray/select-shell/selection-options/sample.png)


###Optional configs
```
var select = require('select-shell')(
  /* These are the default values */
  {
    pointer: '> ',
    pointerColor: 'white',
    checked: ' ✓',
    unchecked: '',
    checkedColor: 'green',
    msgCancel: 'No selected options!',
    msgCancelColor: 'red',
    multiSelect: true,
    inverse: true,
    prepend: false
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
