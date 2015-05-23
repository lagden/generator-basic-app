'use strict';

function packages(pp, usePP) {
  var task = (pp === 'stylus') ? 'grunt-contrib-stylus' : 'grunt-sass';
  var packs = [
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
    'time-grunt',
    'volo'
  ];

  if (usePP) {
    packs.push(task);
  }

  return packs;
}

module.exports = {
  'packages': packages
};
