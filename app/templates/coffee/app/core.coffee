'use strict'

define [
  'templates/sample'
], (template) ->

  d = document;
  $ = (el) -> d.querySelector el

  $info = $('#info')
  $info.insertAdjacentHTML 'afterbegin', template
    name: navigator.appName
    version: navigator.appVersion

  return
