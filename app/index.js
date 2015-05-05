'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var prompt = require('./prompt');
var list = require('./list');
var gruntConfig = require('./grunt');

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

    // Stylus or Sass + Compass
    this.directory(this.whichPP);

    // Others
    this.copy('README.md');
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
    this.copy('_Gruntfile.js', 'Gruntfile.js');

    // Bower
    this.template('_bower.json', 'bower.json');
    this.copy('bowerrc', '.bowerrc');

    // Package
    this.copy('_package.json', 'package.json');
  },
  writing: {
    grunt: function() {
      this.gruntfile.insertConfig('project', gruntConfig.folders(this.whichPP));
      this.gruntfile.insertConfig(this.whichPP, gruntConfig[this.whichPP]());
      this.gruntfile.registerTask('styles', [this.whichPP, 'autoprefixer']);
    },
    package: function() {
      this.log
        .info('Configuring package.json');

      var filepath = this.destinationPath('package.json')
      var pkg = JSON.parse(this.read(filepath));

      pkg.name = this._.slugify(this.projectName);
      pkg.version = '0.1.0';
      pkg.description = this.projectDescription;
      pkg.author.name = this.projectAuthor;
      pkg.scripts.postinstall = 'volo add -skipexists';
      pkg.scripts.start = 'http-server dev -o -a127.0.0.1 -p8285';
      pkg.volo.dependencies.require = 'jrburke/requirejs';
      pkg.volo.dependencies.almond = 'jrburke/almond';
      pkg.volo.dependencies.jade = 'jadejs/jade';
      if (this.useJquery) {
        pkg.volo.dependencies.jquery = 'jquery/jquery';
      }

      this.write(filepath, JSON.stringify(pkg, null, 2));
    },
  },
  install: {
    npm: function() {
      var self = this;
      var done;

      if (this.skipInstall === false) {
        done = this.async();

        this.log
          .write()
          .info('Running ' + chalk.yellow('npm install --save-dev') + ' ' +
            'to install the required devDependencies.')
          .info(chalk.yellow('This might take a few moments'))
          .write();

        var args = list.packages(this.whichPP);
        args.unshift('i');
        args.push('--save-dev');

        this.spawnCommand('npm', args)
          .on('close', function() {
            self.spawnCommand('npm', ['run-script', 'postinstall'])
              .on('close', done)
              .on('error', function(err) {
                self.messages.push('Error: npm run-script postinstall');
                done();
              });
          })
          .on('error', function(err) {
            self.messages.push('Error: npm i --save-dev libs...');
            done();
          });
      }
    },
  },
  end: {
    msg: function() {
      if (this.messages.length === 0) {
        this.log
          .write()
          .ok('Success!!!')
          .write(chalk.red(this.read(this.templatePath('cowsay'))))
          .write();
        return;
      }
      this.log
        .write()
        .error('There were some errors during the process:')
        .write();
      for (var i = 0, m; (m = this.messages[i]); i++) {
        this.log
          .write((i + 1) + ' ' + m);
      }
    }
  }
});