'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var BasicAppGenerator = module.exports = function BasicAppGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
    var cowsay = this.readFileAsString(path.join(__dirname, '../COWSAY'));
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
    this.on('end', function() {
        var installProjectDependencies = !this.installProjectDependencies;
        this.installDependencies({
            skipInstall: installProjectDependencies,
            skipMessage: true,
            callback: function() {
                console.log(cowsay);
            }
        });
    });
};

util.inherits(BasicAppGenerator, yeoman.generators.Base);

BasicAppGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    var prompts = [{
        name: 'projectName',
        message: 'Qual o nome do projeto?',
        default: 'Projeto'
    }, {
        name: 'projectDescription',
        message: 'Qual a descrição do projeto?',
        default: 'Apenas um projeto interessante'
    }, {
        name: 'projectAuthor',
        message: 'Qual o nome do desenvolvedor do projeto?',
        default: 'Thiago Lagden'
    }, {
        name: 'useJquery',
        type: 'confirm',
        message: 'Deseja usar jQuery?',
        default: true
    }, {
        when: function(response) {
            return response.useJquery
        },
        name: 'jqueryVersion',
        type: 'list',
        message: 'Escolha a versão que deseja usar jQuery?',
        choices: ['1.11.2', '2.1.3'],
        default: 1
    }, {
        name: 'useBower',
        type: 'confirm',
        message: 'Deseja também usar Bower?',
        default: true
    }, {
        name: 'installProjectDependencies',
        type: 'confirm',
        message: 'Instalar os pacotes automaticamente?',
        default: true
    }];

    this.prompt(prompts, function(props) {
        this.projectName = props.projectName;
        this.projectDescription = props.projectDescription;
        this.projectAuthor = props.projectAuthor;
        this.useJquery = props.useJquery;
        this.jqueryVersion = props.jqueryVersion;
        this.useBower = props.useBower;
        this.installProjectDependencies = props.installProjectDependencies;
        cb();
    }.bind(this));
};

BasicAppGenerator.prototype.app = function app() {
    // App Dev
    this.directory('dev');

    // Coffee
    this.directory('coffee','coffee');

    // Jade
    this.directory('jade','jade');

    // SASS
    this.copy('config.rb', 'config.rb');
    this.directory('sass','sass');

    // Others
    this.copy('editorconfig'          , '.editorconfig');
    this.copy('jshintrc'              , '.jshintrc');
    this.copy('gitignore'             , '.gitignore');
    this.copy('README.md'             , 'README.md');
    this.template('_Gruntfile.coffee' , 'Gruntfile.coffee');

    // Bower
    if (this.useBower) {
        this.template('_bower.json', 'bower.json');
        this.copy('bowerrc', '.bowerrc');
    }
};

BasicAppGenerator.prototype.writePackage = function writePackage() {
    var _packageFile = path.join(__dirname, './templates/_package.json');
    var _package = JSON.parse(this.readFileAsString(_packageFile));
    _package.name = this._.slugify(this.projectName);
    _package.description = this.projectDescription;
    _package.author.name = this.projectAuthor;
    _package.scripts.install = 'node_modules/volo/bin/volo add -skipexists' + (this.useBower ? ' && bower install' : '');
    _package.volo.dependencies['require'] = "github:jrburke/requirejs/2.1.15";
    _package.volo.dependencies['almond'] = "github:jrburke/almond/0.3.0";
    _package.volo.dependencies['jade'] = "https://raw.githubusercontent.com/visionmedia/jade/1.7.0/runtime.js";
    if (this.useJquery) _package.volo.dependencies['jquery'] = 'http://code.jquery.com/jquery-' + this.jqueryVersion + '.js';
    this.write('package.json', JSON.stringify(_package));
};
