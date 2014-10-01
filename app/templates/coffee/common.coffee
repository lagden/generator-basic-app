define 'common', ->

  'use strict'

  requirejs.config
    baseUrl: 'js/lib'
    paths:
      app: '../app'
      templates: '../templates'

  return
