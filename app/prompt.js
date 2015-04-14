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
  },{
    name: 'useJquery',
    type: 'confirm',
    message: 'Deseja usar jQuery?',
    default: true
  }];
}

module.exports = {
  'questions': questions
}