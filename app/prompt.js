'use strict';

function questions(defaults) {
  defaults = defaults || {};
  return [{
    name: 'projectName',
    message: 'Qual o nome do projeto?',
    default: defaults.projectName || 'Projeto'
  }, {
    name: 'projectDescription',
    message: 'Qual a descrição do projeto?',
    default: defaults.projectDescription || 'Apenas um projeto interessante'
  }, {
    name: 'projectAuthor',
    message: 'Qual o nome do desenvolvedor do projeto?',
    default: defaults.projectAuthor || 'Thiago Lagden'
  }, {
    name: 'whichPP',
    type: 'list',
    message: 'Escolha o pré-processador de css?',
    choices: ['sass', 'stylus'],
    default: 1
  }, {
    when: function(response) {
      return (response.whichPP === 'sass') ? true : false;
    },
    name: 'useCompass',
    type: 'confirm',
    message: 'Deseja usar o Compass?',
    default: false
  }, {
    name: 'useJquery',
    type: 'confirm',
    message: 'Deseja usar jQuery?',
    default: false
  }];
}

module.exports = {
  'questions': questions
}
