'use strict';

var os = require('os'),
    exec = require('child_process').exec,
    serverPort = <%= projectLocalServerPort %>;

module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    var buildConfigMain = grunt.file.readJSON('tools/build.js'),
        pathBuildDoc = 'build/',
        pathDevDoc = 'dev/',
        pathDevJs = pathDevDoc + 'js/';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            app: {
                src: [pathBuildDoc]
            },
            end:{
                src: [pathBuildDoc + 'js/templates']
            }
        },
        jshint: {
            app: {
                files: {
                    src: [pathDevJs + '**/*.js']
                },
                options: {
                    jshintrc: '.jshintrc',
                    ignores: [pathDevJs + 'lib/**/*.js']
                }
            }
        },
        compass: {
            app: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        connect: {
            dev: buildConnect(serverPort, '*', false, true, true, pathDevDoc),
            build: buildConnect(serverPort, '*', true, false, false, pathBuildDoc)
        },
        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['compass']
            },
            css: {
                files: [pathDevDoc + 'css/**/*.css'],
                options: {
                    livereload: true
                }
            },
            scripts: {
                files: [pathDevDoc + 'js/**/*.js'],
                tasks: ['jshint:app'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    grunt.registerTask(
        'requirejs',
        'Run the r.js build script',
        function() {
            var done = this.async(),
                command = (os.platform() == 'win32') ? 'r.js.cmd' : 'r.js';
            exec(command + ' -o ./tools/build.js',
                function(err, stdout, stderr) {
                    if (err) {
                        grunt.fail.fatal('Problem with r.js: ' + err + ' ' + stderr);
                    }
                    grunt.log.writeln(stdout);
                    grunt.log.ok('Build complete.');
                    done();
                }
            );
        }
    );
    grunt.registerTask('default', ['clean:app', 'compass:app', 'jshint:app']);
    grunt.registerTask('server', ['default', 'connect:dev', 'watch']);
    grunt.registerTask('build', ['default', 'requirejs', 'clean:end']);
};

function buildConnect(port, hostname, keepalive, livereload, debug, base, open) {
    var o = {
        'options': {
            'port': port || 9000,
            'hostname': hostname || '*',
            'keepalive': keepalive || false,
            'livereload': livereload || false,
            'debug': debug || false,
            'base': base,
            'open': open || 'http://localhost:' + port + '/index.html'
        }
    }
    return o;
}