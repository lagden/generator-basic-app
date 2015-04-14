'use strict';

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

      pkg.name = this._.slugify(this.projectName);
      pkg.version = '0.1.0';
      pkg.description = this.projectDescription;
      pkg.author.name = this.projectAuthor;
      pkg.main = 'dev/index.html';
      pkg.scripts.install = 'node_modules/volo/bin/volo add -skipexists';
      pkg.volo.dependencies.require = 'jrburke/requirejs';
      pkg.volo.dependencies.almond = 'jrburke/almond';
      pkg.volo.dependencies.jade = 'jadejs/jade';
      if (this.useJquery) {
        pkg.volo.dependencies.jquery = 'jquery/jquery';
      }

      this.writeFileFromString(JSON.stringify(pkg, null, 2), filepath);
    },
    npm: function() {
      var self = this;
      var done;

      if (this.skipInstall === false) {
        done = this.async();

        /*jshint expr:true */
        this.log.write()
          .info('Running ' + chalk.yellow('npm install') + ' ' +
            'to install the required dependencies. ')
          .info(chalk.yellow('This might take a few moments'))
          .write();
        /*jshint expr:false */

        var args = list.packages();
        args.unshift('i');
        args.push('--save-dev');

        this.spawnCommand('npm', args).on('close', function() {
          self.spawnCommand('npm', ['run-script', 'install']).on('close', done);
        });
      }
    },
  },
  end: function() {
    if (this.messages.length === 0) {
      var cowsay = this.readFileAsString(path.join(__dirname, './COWSAY'));
      /*jshint expr:true */
      this.log.write()
        .ok('Success!!!')
        .info(chalk.red(cowsay));
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
