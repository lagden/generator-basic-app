'use strict'

define [
  'templates/sample'
  'jquery'
], (template, $) ->


  $info = $('#info')
  $info.append template
    name: navigator.appName
    version: navigator.appVersion

  return
