select-shell
============

##### **Item selection _for commandline nodejs apps._**

- [x] Easy to use.
- [x] Single / multiple item-select.
- [x] Optional cancel message.
- [x] Color/styling/spacing options.
- [x] Only depends on 'colors'!


![select-shell example image](https://raw.github.com/mralexgray/select-shell/selection-options/sample.png)


#### Installation
```
npm install select-shell
```

#### Usage

Simply navigate + make selection with the arrow keys...

**Up and Down** - Navigates on the options<br/>
**Right** - Check the option<br/>
**Left** - Uncheck the option<br/>
**Enter/Return** - confirms the options selected<br/>
**Esc** - Cancel/Exit<br/>

#### Code
```js
'use strict';

var list = require('./index')(
  /* possible configs */
  {
    pointer: ' ▸ ',
    pointerColor: 'yellow',
    checked: ' ◉  ',
    unchecked:' ◎  ',
    checkedColor: 'blue',
    msgCancel: 'No selected options!',
    msgCancelColor: 'orange',
    multiSelect: true,
    inverse: true,
    prepend: true,
    disableInput: true
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

#### Optional configs
```js
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
    inverse: false,
    prepend: false,
    disableInput: true
  }
);
```

#### And for coffee drinkers, please see `sample.coffee`.

```coffee
list = require('.')
  pointer    : ' ► '
  checked    : ' ◉  '
  unchecked  : ' ◎  '
  prepend    : true
```

#### The scheme of color is equal to the module [colors](https://github.com/Marak/colors.js "module colors").

| style | color | theme|
|----------|------|------|
| bold        | yellow   | rainbow |
| italic      | cyan     | random  |
| underline   | white    | zebra   |
| inverse     | magenta  |         |
|             | green    |         |
|             | red      |         |
|             | grey     |         |
|             | blue     |         |
