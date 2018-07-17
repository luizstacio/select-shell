'use strict';

/**
 * Module dependencies.
 *
 */
var eventEmitter = require('events').EventEmitter;
var encode = require('./encode');
var colors = require('colors');
var readline = require('readline');
var stream = process.stdin;
var processOut = process.stdout;

process.on('exit', function () {
  processOut.write(encode('[?25h'));
})

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
    prepend: false,
    disableInput: true
  };
  this.options = [];
  this.optionsLength = 0;
  this.pointerPosition = 0;
  this.optionsSelected = [];
  this.currentoption = undefined;
  this.select = undefined;
  this.keypress = this.keypress.bind(this);
  this.onData = this.onData.bind(this);
  this.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  for ( var c in conf ) {
    this.config[c] = conf[c];
  }

  stream.on('error', function (err) {
    console.error(err);
    process.exit();
  })
  stream.on('keypress', this.keypress);
  stream.on('data', this.onData);
};


/**
 * Disable input
 *
 * @api private
 */
Select.prototype.onData = function () {
  if (this.config.disabledInput) {
    readline.clearLine(processOut);
  }
}

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
  var indent = me.config.pointer.replace(/./g, ' ');
  var checkedChar = me.config.checked[ me.config.checkedColor ];
  var uncheckedChar = me.config.unchecked[ me.config.uncheckedColor ];

  me.options.forEach(function(option, position){

    var isHighlighted = (position === me.pointerPosition);
    var prefix = isHighlighted ? me.config.pointer : indent;

    var checked = me.config.multiSelect ?
                  me.optionsSelected.indexOf(option) !== -1 ? checkedChar : uncheckedChar
                  : '';

    me.currentoption = isHighlighted ? option : me.currentoption;

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
  readline.cursorTo(processOut, 0);
  readline.moveCursor(processOut, 0, -this.optionsLength);
  readline.clearScreenDown(processOut);
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
    readline.moveCursor(processOut, 0, -1);/* remove new line */
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
  this.rl.close();
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
    readline.moveCursor(processOut, 0, -1);/* remove new line */
    this.selectoption();
    break;
  case 'escape':
    this.cancel();
    break;
  default: break;
  }
};
