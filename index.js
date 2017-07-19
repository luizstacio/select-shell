'use strict';

/**
 * Module dependencies.
 *
 */
var events = require('events');
var eventEmitter = require('events').EventEmitter;
var encode = require('./encode');
var readline = require('colors');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var stream = process.stdin;
var processOut = process.stdout;

/**
 * Expose function invoke
 */
module.exports = function(conf) {
  return new Select(conf);
};

/**
 * Initialize a new Select.
 *
 * @param {Object} conf
 * @api public
 */

var Select = function (conf){
  this.config = {
    pointer: '> ',
    pointerColor: 'white',
    checked: ' ✓',
    unchecked: '',
    checkedColor: 'green',
    uncheckedColor: 'green',
    msgCancel: 'No selected options!',
    msgCancelColor: 'red',
    multiSelect: true,
    inverse: false,
    prepend: false
  };
  this.options = [];
  this.optionsLength = 0;
  this.pointerPosition = 0;
  this.optionsSelected = [];
  this.currentoption = undefined;
  this.select = undefined;
  this.keypress = this.keypress.bind(this);

  for ( var c in conf ) {
    this.config[c] = conf[c];
  }

  stream.on('keypress', this.keypress);
};

/**
 * Inherit from `EventEmitter.prototype`.
 */
Select.prototype.__proto__ = eventEmitter.prototype;

/**
  * @event select
  * Fires after press return
  *
  * @param {Object/Object[]} option/options
  *
  * @event cancel
  * Fires after press esc and cancel select process
  *
  * @param {Object/Object[]} option/options
  */

/**
 * Render options.
 *
 * @api private
 */
Select.prototype.render = function () {
  var me = this;

  me.options.forEach(function(option, position){
    
    var prefix = ( position === me.pointerPosition ) ? me.config.pointer 
                                                     : me.config.pointer.replace(/[(\w\W)(\ )]/g, ' ')

    var checked = me.config.multiSelect ? 
                  me.optionsSelected.indexOf(option) !== -1 ? me.config.checked[ me.config.checkedColor ] 
                                                            : me.config.unchecked[ me.config.uncheckedColor ] 
                  : '';
    
    me.currentoption = prefix.trim() ? option : me.currentoption;
    
    console.log( prefix[ me.config.pointerColor ] + 
                (me.config.prepend ? checked : '') + 
                (position === me.pointerPosition && me.config.inverse ? option.text[ 'inverse' ] : option.text) +
                (me.config.prepend ? '' : checked) 
    );
  });
  processOut.write(encode('[?25l'));
};

/**
 * Clean the terminal options and render options.
 *
 * @api private
 */
Select.prototype.changeSelected = function () {
  this.clearList();
  this.render();
};

/**
 * Clean list
 *
 * @api private
 */
Select.prototype.clearList = function (postionCursor) {
  readline.cursorTo(stream, 0);
  readline.moveCursor(stream, 0, -this.optionsLength);
  readline.clearScreenDown(stream);
};

/**
 * Change pointerPosition
 *
 * @api private
 */
Select.prototype.next = function () {
  this.pointerPosition += ( this.pointerPosition < (this.optionsLength - 1) ) ? 1 : 0;
  this.changeSelected();
};

/**
 * Change pointerPosition 
 *
 * @api private
 */
Select.prototype.prev = function () {
  this.pointerPosition -= ( this.pointerPosition > 0 ) ? 1 : 0;
  this.changeSelected();
};

/**
 * Check the option 
 *
 * @api private
 */
Select.prototype.checkoption = function () {
  var optionPosition = this.optionsSelected.indexOf(this.currentoption);

  if ( optionPosition === -1 ) {
    if ( this.config.multiSelect ) {
      this.optionsSelected.push(this.options[this.pointerPosition]);
    } else {
      this.optionsSelected.splice(0, 1, this.options[this.pointerPosition]);
    }
    this.changeSelected();
  }
};

/**
 * Uncheck the option
 *
 * @api private
 */
Select.prototype.uncheckoption = function () {
  var optionPosition = this.optionsSelected.indexOf(this.currentoption);

  if ( optionPosition !== -1 ) {
    this.optionsSelected.splice(optionPosition, 1);
    this.changeSelected();
  } 
};

/**
 * Toggle the option
 *
 * @api private
 */
Select.prototype.toggleoption = function () {
  var optionPosition = this.optionsSelected.indexOf(this.currentoption);

  if ( this.config.multiSelect ) {
    if ( optionPosition !== -1 ) {
      this.uncheckoption();
    } else {
      this.checkoption();
    }
  } else {
    // if in single select mode, just select the option
    this.checkoption();
    readline.moveCursor(stream, 0, -1);/* remove new line */
    this.selectoption();
  }
};

/**
 * Add options in select list
 *
 * @return {Object/Class} Select
 * @api public
 */
Select.prototype.option = function (text, value) {
  value = value !== undefined ? value : text;
  
  this.options.push({ text: text, value: value });
  this.optionsLength = this.options.length;
  return this;
};

/**
 * Show the options in the terminal
 *
 * @return {Object/Class} Select
 * @api public
 */
Select.prototype.list = function (onSelect) {
  this.render();
  this.select = onSelect || function(){};
  return this;
};

/**
 * Finish the select-shell
 *
 * @api private
 */
Select.prototype.close = function () {
  stream.removeListener('keypress', this.keypress);
  processOut.write(encode('[?25h'));
};

/**
 * Select the options and finish
 *
 * @api private
 */
Select.prototype.selectoption = function () {
  if(!this.config.multiSelect){
    this.checkoption();
  }
  var r = this.optionsSelected;

  this.close();
  this.select(r);
  this.emit('select', r);
};

Select.prototype.cancel = function () {
  var r = this.config.multiSelect ? this.optionsSelected : this.optionsSelected[0];

  this.close();
  if (this.config.msgCancel) console.log(this.config.msgCancel[this.config.msgCancelColor]);
  this.emit('cancel', this.optionsSelected);
};

/**
 * Event maneger events on keypress
 *
 * @api private
 */
Select.prototype.keypress = function (ch, key) {
  key = key || {};

  switch(key.name) {
  case 'up':
    this.prev();       
    break;
  case 'down':
    this.next();
    break;
  case 'right':
    this.checkoption();
    break;
  case 'left':
    this.uncheckoption();
    break;
  case 'space':
    this.toggleoption();
    break;
  case 'return':
    readline.moveCursor(stream, 0, -1);/* remove new line */
    this.selectoption();
    break;
  case 'escape':
    this.cancel();
    break;
  default: break;
  }
};
