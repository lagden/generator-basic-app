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
        name: 'projectLocalServerPort',
        message: 'Qual é será a porta utilizada pelo servidor local?',
        default: 9000
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
        choices: ['1.10.2', '2.0.3'],
        default: 1
    }, {
        name: 'useHandlebars',
        type: 'confirm',
        message: 'Deseja usar Handlebars?',
        default: true
    }, {
        when: function(response) {
            return response.useHandlebars
        },
        name: 'useRequireText',
        type: 'confirm',
        message: 'Deseja utilizar o plugin "text" para auxiliar no carregamento dos recursos?',
        default: true
    }, {
        name: 'addHtml5shiv',
        type: 'confirm',
        message: 'Deseja adicionar o html5shiv?',
        default: false
    }, {
        name: 'useBower',
        type: 'confirm',
        message: 'Deseja também usar Bower?',
        default: false
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
        this.projectLocalServerPort = props.projectLocalServerPort;
        this.useJquery = props.useJquery;
        this.jqueryVersion = props.jqueryVersion;
        this.useHandlebars = props.useHandlebars;
        this.useRequireText = props.useRequireText;
        this.addHtml5shiv = props.addHtml5shiv;
        this.useBower = props.useBower;
        this.installProjectDependencies = props.installProjectDependencies;
        cb();
    }.bind(this));
};

BasicAppGenerator.prototype.app = function app() {
    // App Dev
    this.directory('dev');

    // Bower
    if (this.useBower) {
        this.template('_bower.json', 'bower.json');
        this.copy('bowerrc', '.bowerrc');
    }

    // SASS
    this.copy('config.rb', 'config.rb');
    this.directory('sass','sass');

    // Tools - r.js
    this.directory('tools');

    // Others
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
    this.copy('README.md', 'README.md');
    this.template('_Gruntfile.js', 'Gruntfile.js');
};

BasicAppGenerator.prototype.writePackage = function writePackage() {
    var _packageFile = path.join(__dirname, './templates/_package.json');
    var _package = JSON.parse(this.readFileAsString(_packageFile));
    _package.name = this.projectName;
    _package.description = this.projectDescription;
    _package.author.name = this.projectAuthor;
    _package.volo.dependencies['require'] = "github:jrburke/requirejs/2.1.9";
    if (this.useRequireText) _package.volo.dependencies['text'] = "github:requirejs/text/2.0.10";
    if (this.useJquery) _package.volo.dependencies['jquery'] = 'http://ajax.googleapis.com/ajax/libs/jquery/' + this.jqueryVersion + '/jquery.js';
    if (this.addHtml5shiv) _package.volo.dependencies['html5shiv'] = 'http://rawgithub.com/aFarkas/html5shiv/master/dist/html5shiv.js';
    if (this.useHandlebars) _package.volo.dependencies['handlebars'] = 'http://builds.handlebarsjs.com.s3.amazonaws.com/handlebars-v1.3.0.js';
    this.write('package.json', JSON.stringify(_package));
};