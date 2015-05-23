'use strict';

function folders(whichPP) {
  whichPP = whichPP || 'dev/css';
  var project = {
    prod: 'build',
    dev: 'dev',
    tmp: 'tmp',
    coffee: 'coffee',
    jade: 'jade',
    css: whichPP
  };
  return JSON.stringify(project);
}

function autoprefixer(usePP) {
  var cwdDir = usePP ? '<%= project.tmp %>/css' : '<%= project.dev %>/css';
  var autoprefixer = {
    options: {
      browsers: ['last 1 version']
    },
    files: {
      expand: true,
      flatten: false,
      cwd: cwdDir,
      src: ['*.css'],
      dest: '<%= project.dev %>/css',
      ext: '.css'
    }
  };
  return JSON.stringify(autoprefixer);
}

function sass() {
  var sass = {
    dev: {
      options: {
        outputStyle: 'expanded',
        precision: 4,
        sourcemap: 'none',
        includePaths: []
      },
      files: [{
        expand: true,
        flatten: false,
        cwd: '<%= project.css %>',
        src: ['*.sass'],
        dest: '<%= project.tmp %>/css',
        ext: '.css'
      }]
    }
  };
  return JSON.stringify(sass);
}

function stylus() {
  var stylus = {
    dev: {
      options: {
        compress: false
      },
      files: [{
        expand: true,
        flatten: false,
        cwd: '<%= project.css %>',
        src: ['*.styl'],
        dest: '<%= project.tmp %>/css',
        ext: '.css'
      }]
    }
  };
  return JSON.stringify(stylus);
}

module.exports = {
  'sass': sass,
  'stylus': stylus,
  'folders': folders,
  'autoprefixer': autoprefixer,
};
