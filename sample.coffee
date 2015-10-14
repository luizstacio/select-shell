#!/usr/bin/env coffee

list = require('.')
  pointer       : ' ► '
  checked       : ' ◉  '
  unchecked     : ' ◎  '
  prepend       : true

stream = process.stdin

list.option ' One    ', 0x00000001
    .option ' Two    ', 0x00000011
    .option ' Three  ', 0x00000111
    .list()

list.on 'select', (options) ->
  console.log 'select', options
  process.exit 0

list.on 'cancel', (options) ->
  console.log "Cancel list, #{options.length} options selected"
  process.exit 0