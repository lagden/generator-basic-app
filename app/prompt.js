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
    name: 'usePP',
    type: 'confirm',
    message: 'Deseja utilizar algum pré-processador de CSS?',
    default: true
  }, {
    when: function(response) {
      return response.usePP;
    },
    name: 'whichPP',
    type: 'list',
    message: 'Escolha o pré-processador de CSS?',
    choices: ['sass', 'stylus'],
    default: 1
  }, {
    name: 'useJquery',
    type: 'confirm',
    message: 'Deseja usar jQuery?',
    default: false
  }];
}

module.exports = {
  'questions': questions
};
