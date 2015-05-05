'use strict';

function packages(pp) {
  var task = (pp === 'stylus') ? 'grunt-contrib-stylus' : 'grunt-sass';
  return [
    task,
    'grunt',
    'grunt-autoprefixer',
    'grunt-browser-sync',
    'grunt-concurrent',
    'grunt-contrib-clean',
    'grunt-contrib-coffee',
    'grunt-contrib-copy',
    'grunt-contrib-cssmin',
    'grunt-contrib-jade',
    'grunt-contrib-requirejs',
    'grunt-contrib-watch',
    'grunt-fixmyjs',
    'grunt-minify-html',
    'http-server',
    'jit-grunt',
    'jshint-stylish',
    'time-grunt',
    'volo'
  ];
}

module.exports = {
  'packages': packages
};
