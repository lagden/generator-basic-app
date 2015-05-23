/*global describe, before, it*/
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('yo basic-app', function() {

  before(function(done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['--skip-install'])
      .withPrompt({
        projectName: 'Teste',
        projectDescription: 'Executando o teste',
        projectAuthor: 'Mocha',
        useJquery: false,
        whichPP: 'stylus'
      })
      .on('end', done);
  });

  it('can be imported without blowing up', function() {
    var app = require('../app');
    assert(app !== undefined);
  });

  it('creates expected files', function() {
    var expected = [
      'package.json',
      'bower.json',
      '.bowerrc',
      '.editorconfig',
      '.gitignore',
      '.jshintrc',
      '.jscsrc',
      'Gruntfile.js',
      'README.md',
      'coffee/config.coffee',
      'coffee/main.coffee',
      'coffee/app/core.coffee',
      'dev/favicon.ico',
      'dev/css/app.css',
      'jade/html/index.jade',
      'jade/js/sample.jade',
      'stylus/app.styl'
    ];

    assert.file(expected);
  });

});
