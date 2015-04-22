'use strict';

function packages(pp) {
  return [
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
    'grunt-contrib-' + pp,
    'grunt-contrib-watch',
    'grunt-fixmyjs',
    'grunt-minify-html',
    'jshint-stylish',
    'load-grunt-tasks',
    'time-grunt',
    'volo'
  ];
}

module.exports = {
  'packages': packages
}
