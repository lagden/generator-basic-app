'use strict'

random = require 'random-js'
serverPort = random().integer 8200, 8500

module.exports = (grunt) ->

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    sass:
      plugin:
        options:
          style: 'expanded'
          noCache: true
          compass: true
        files:
          'dev/css/main.css': 'sass/main.scss'

    autoprefixer:
      dist:
        src: 'dev/css/main.css'
        dest: 'dev/css/main.css'

    watch:
      sass:
        files: ['sass/{,*/}*.scss']
        tasks: ['sass', 'autoprefixer']

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
              name: '../main'
              include: ['app/main']
              exclude: ['../common']
            }
            {
              name: '../another'
              include: ['app/another']
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
    'sass'
    'autoprefixer'
    'requirejs'
  ]
  grunt.registerTask 'server', [
    'default'
    'browserSync:dev'
    'watch'
  ]

  grunt.registerTask 'build', [
    'clean'
    'default'
  ]

  return
