define (require) ->

  'use strict'

  $ = require 'jquery'
  template = require 'templates/sample'

  $.fn.ready ->

    $info = $('#info')
    $info.append template
      name: navigator.appName
      version: navigator.appVersion

    return

  return
