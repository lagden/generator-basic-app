'use strict';

var exec = require('child_process').exec;
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var prompt = require('./prompt');
var list = require('./list');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.skipWelcome = true;
    this.option('skip-install', {
      desc: 'Do not install dependencies',
      type: Boolean,
      defaults: false
    });
    this.skipInstall = this.options['skip-install'];
    this.messages = [];
  },

  prompting: function() {
    var self = this;
    var done = this.async();
    var questions = prompt.questions();

    this.prompt(questions, function(answers) {
      var prop = Object.getOwnPropertyNames(answers);
      prop.forEach(function(name) {
        self[name] = answers[name];
      });
      done();
    });
  },

  app: function() {
    // App Dev
    this.directory('dev');

    // Coffee
    this.directory('coffee');

    // Jade
    this.directory('jade');

    // SASS + Compass
    this.copy('config.rb');
    this.directory('sass');

    // Others
    this.copy('README.md');
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
    this.copy('_Gruntfile.coffee', 'Gruntfile.coffee');

    // Bower
    this.template('_bower.json', 'bower.json');
    this.copy('bowerrc', '.bowerrc');

    // Package
    this.copy('_package.json', 'package.json');
  },

  install: {
    prepara: function() {
      /*jshint expr:true */
      this.log.info('Configuring package.json');
      /*jshint expr:false */

      var filepath = path.join(this.destinationRoot(), 'package.json');
      var pkg = JSON.parse(this.readFileAsString(filepath));

      pkg.name = (this.projectName)
        .replace(/[^0-9a-z_\-]/ig, '-')
        .replace(/-+/g, '-');
      pkg.version = '0.1.0';
      pkg.description = this.projectDescription;
      pkg.author.name = this.projectAuthor;
      pkg.main = 'dev/index.html';

      this.writeFileFromString(JSON.stringify(pkg, null, 2), filepath);
    },
    npm: function() {
      if (this.skipInstall !== false) {
        var log = this.log;
        var done = this.async();
        var bin = path.join(this.destinationRoot(), 'node_modules/volo/bin/volo');
        var dir = path.join(this.destinationRoot());
        var cmd = [
          bin + ' add -skipexists jrburke/requirejs',
          bin + ' add -skipexists jrburke/almond',
          bin + ' add -skipexists jadejs/jade'
        ];

        if (this.useJquery) {
          cmd.push(bin + ' add -skipexists jquery/jquery')
        }

        /*jshint expr:true */
        log.write()
          .info('Running ' + chalk.yellow('npm install') + ' ' +
            'to install the required dependencies. ' +
            'If this fails, try running the command yourself.')
          .info(chalk.yellow('This might take a few moments'))
          .write();
        /*jshint expr:false */
        this.npmInstall(list.packages(), {
          'saveDev': true
        }, function() {
          /*jshint expr:true */
          log.info('Install ' + chalk.yellow('Volo') + ' required dependencies.');
          /*jshint expr:false */

          exec(cmd.join(' && '), {
            cwd: dir
          }, function(err, stdout) {
            /*jshint expr:true */
            log && log.write().info(stdout);
            /*jshint expr:false */
            done();
          });
        });
      }
    }
  },

  end: function() {
    if (this.messages.length === 0) {
      /*jshint expr:true */
      this.log.write().ok('You are all set now. Happy coding!');
      /*jshint expr:false */
      return;
    }
    this.log.write().error('There were some errors during the process:').write();
    for (var i = 0, m;
      (m = this.messages[i]); i++) {
      this.log.write((i + 1) + ' ' + m);
    }
  }

});
