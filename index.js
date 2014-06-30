'use strict';

var config = {
  pointer: '> ',
  pointerColor: 'white',
  checked: ' ✓',
  checkedColor: 'green',
  msgCancel: 'No selected options!',
  msgCancelColor: 'red'
};

module.exports = function(conf){
  
  for ( var c in conf ) {
    config[c] = conf[c];
  }

  return {
    option: option,
    list: list,
    event: eventEmitter
  };
};

var events = require('events');
var eventEmitter = new events.EventEmitter();

var encode = require('./encode');
var readline = require('colors');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var stream = process.stdin;
var processOut = process.stdout;

var options = [],
    optionsLength = 0,
    pointerPosition = 0,
    optionsSelected = [],
    currentoption,
    select = function(){};

function render () {
  options.forEach(function(option, position){
    var prefix = (position === pointerPosition) ? config.pointer : config.pointer.replace(/[(\w\W)(\ )]/g, ' '),
        checked = optionsSelected.indexOf(option) !== -1 ? config.checked[config.checkedColor] : '';
    
    currentoption = prefix.trim() ? option : currentoption;
    console.log(prefix[config.pointerColor]+option.text+checked);
  });
  processOut.write(encode('[?25l'));
}

function changeSelected () {
  clearList();
  render();
}

function clearList (postionCursor) {
  readline.cursorTo(stream, 0);
  readline.moveCursor(stream, 0, -optionsLength);
  readline.clearScreenDown(stream);
}

function next () {
  pointerPosition += ( pointerPosition < (optionsLength - 1) ) ? 1 : 0;
  changeSelected();
}

function prev () {
  pointerPosition -= ( pointerPosition > 0 ) ? 1 : 0;
  changeSelected();
}

function checkoption () {
  var optionPosition = optionsSelected.indexOf(currentoption);

  if ( optionPosition === -1 ) {
    optionsSelected.push(options[pointerPosition]);
    changeSelected();
  }
}

function uncheckoption () {
  var optionPosition = optionsSelected.indexOf(currentoption);

  if ( optionPosition !== -1 ) {
    optionsSelected.splice(optionPosition, 1);
    changeSelected();
  } 
}

function option (text, value) {
  options.push({ text: text, value: value || text });
  optionsLength = options.length;
  return this;
}

function list (onSelect) {
  render();
  select = onSelect || select;
  return this;
}

function close () {
  stream.removeListener('keypress', keypress);
  processOut.write(encode('[?25h'));
}

function selectoption () {
  close();
  select(optionsSelected);
  eventEmitter.emit('select', optionsSelected);
}

function keypress (ch, key) {
  switch(key.name) {
  case 'up':
    prev();       
    break;
  case 'down':
    next();
    break;
  case 'right':
    checkoption();
    break;
  case 'left':
    uncheckoption();
    break;
  case 'return':
    readline.moveCursor(stream, 0, -1);/* remove new line */
    selectoption();
    break;
  case 'escape':
    close();
    if (config.msgCancel) console.log(config.msgCancel[config.msgCancelColor]);
    eventEmitter.emit('cancel', optionsSelected);
    break;
  default: break;
  }
}

stream.on('keypress', keypress);