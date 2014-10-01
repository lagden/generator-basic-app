'use strict'

random = require 'random-js'
serverPort = random().integer 8200, 8500

module.exports = (grunt) ->

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    coffeelint:
      app: ['coffee/{,*/}*.coffee']

    coffee:
      compile:
        options:
          bare: true
        expand: true,
        flatten: false,
        cwd: 'coffee/',
        src: ['{,*/}*.coffee'],
        dest: 'dev/js/',
        ext: '.js'

    jade:
      html:
        options:
          pretty: false
        files:
          'dev/index.html': ['jade/html/index.jade']
      js:
        options:
          amd: true
          client: true
          namespace: false
        files:
          'dev/js/templates/sample.js': ['jade/js/sample.jade']

    sass:
      plugin:
        options:
          style: 'expanded'
          noCache: false
          compass: true
          update: true
          unixNewlines: true
        files:
          'dev/css/app.css': 'sass/app.sass'

    autoprefixer:
      dist:
        src: 'dev/css/app.css'
        dest: 'dev/css/app.css'

    watch:
      script:
        files: ['coffee/{,*/}*.coffee']
        tasks: ['coffeelint', 'coffee']

      sass:
        files: ['sass/{,*/}*.sass']
        tasks: ['sass', 'autoprefixer']

      jade2html:
        files: ['jade/html/{,*/}*.jade']
        tasks: ['jade:html']

      jade2js:
        files: ['jade/js/{,*/}*.jade']
        tasks: ['jade:js']

    clean:
      dist: ["build"]

    browserSync:
      dev:
        bsFiles:
          src: 'dev/css/*.css'
        options:
          notify: true
          watchTask: true,
          port: serverPort
          server:
            baseDir: [
              'dev/.'
            ]

      dist:
        bsFiles:
          src: 'build/css/*.css'
        options:
          notify: false
          watchTask: false,
          port: serverPort
          server:
            baseDir: [
              'build/.'
            ]

    requirejs:
      compile:
        options:
          optimize: 'uglify2'
          removeCombined: true
          generateSourceMaps: false
          preserveLicenseComments: false
          optimizeCss: 'none'
          appDir: 'dev' # dev
          dir: 'build'  # prod
          baseUrl: 'js/lib',
          mainConfigFile: 'dev/js/common.js',
          modules: [
            {
              name: '../common'
              include: ['jquery']
            }
            {
              name: '../app'
              include: ['app/app', 'templates/sample']
              exclude: ['../common']
            }
          ]
          done: (done, output) ->
            duplicates = require('rjs-build-analysis').duplicates(output)
            if duplicates.length > 0
              grunt.log.subhead 'Duplicates found in requirejs build:'
              grunt.log.warn duplicates
              return done(new Error 'r.js built duplicate modules.')
            done()
            return

  grunt.registerTask 'default', [
    'coffeelint'
    'coffee'
    'jade'
    'sass'
    'autoprefixer'
  ]

  grunt.registerTask 'build', [
    'clean'
    'default'
    'requirejs'
  ]

  grunt.registerTask 'server', [
    'default'
    'browserSync:dev'
    'watch'
  ]

  grunt.registerTask 'server:prod', [
    'build'
    'browserSync:dist'
  ]

  return
