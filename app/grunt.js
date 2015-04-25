'use strict';

function folders(pp) {
  var project = {
    prod   : 'build',
    dev    : 'dev',
    tmp    : 'tmp',
    coffee : 'coffee',
    jade   : 'jade',
    pre    : pp
  };
  return JSON.stringify(project);
}

function sass() {
  var sass = {
    dev: {
      options: {
        outputStyle  : 'expanded',
        precision    : 5,
        sourcemap    : 'none',
        includePaths : []
      },
      files: [{
        expand  : true,
        flatten : false,
        cwd     : '<%= project.pre %>',
        src     : ['*.sass'],
        dest    : '<%= project.tmp %>/css',
        ext     : '.css'
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
        expand  : true,
        flatten : false,
        cwd     : '<%= project.pre %>',
        src     : ['*.styl'],
        dest    : '<%= project.tmp %>/css',
        ext     : '.css'
      }]
    }
  };
  return JSON.stringify(stylus);
}

module.exports = {
  'sass'    : sass,
  'stylus'  : stylus,
  'folders' : folders
};
