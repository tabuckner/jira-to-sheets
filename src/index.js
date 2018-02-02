#!/usr/bin/env node

const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const chalk = require('chalk');
const log = console.log;
const success = chalk.bold.green;
const error = chalk.bold.red;
const hint = chalk.gray;
const authentication = require("./lib/authentication");
const parser = require('./lib/parser');
const tester = require('./lib/test');
const Client = require('node-rest-client').Client;
let client = new Client();
const config = require('../config/config');

prompt(config.questions)
  .then(answers => {
    inputHandler(answers);
  });

function inputHandler(answers) {
  
  if (answers.initial === false) {
    if (answers.sheetKey.includes('http')) {
      let key = answers.sheetKey.split('/d/');
      answers.sheetKey = key[1].split('/')[0];
    }
    logIn(answers);
  } else {
    authentication.authenticate().then((auth) => {
      log(success('\nAuthentication saved, ' + success.underline('please restart the tool.') + '\n'));
    });
  }
}

function logIn(answers) {
  let jqlProject;
  answers.project === 'CORE & TBN' ? jqlProject = 'in (CORE, TBN)' : jqlProject = '= ' + answers.project;

  config.loginArgs = {
    headers: {
      "Content-Type": "application/json"
    },
    data: {}
  }
  if (config.default.user && answers.atlUser !== config.default.user) {
    config.loginArgs.data.username = answers.atlUser;
    config.loginArgs.data.password = answers.atlPassword;
  }
  config.loginArgs.data = {
    "username": answers.atlUser,
    "password": answers.atlPassword
  }

  // Log In 
  client.post("https://theappraisallane.atlassian.net/rest/auth/1/session", config.loginArgs, function (data, response) {
    if (response.statusCode == 200) {
      config.session = data.session;
      config.searches = {
        current: {
          type: 'current',
          args: {
            headers: {
              cookie: config.session.name + '=' + config.session.value, // Set the cookie from the session information
              "Content-Type": "application/json"
            },
            data: {
              jql: "project " + jqlProject + " AND issuetype in (Bug, Story, Task) AND Sprint in openSprints() ORDER BY cf[10012] ASC"
            }
          }
        },
        future: {
          type: 'future',
          args: {
            headers: {
              cookie: config.session.name + '=' + config.session.value,
              "Content-Type": "application/json"
            },
            data: {
              jql: "project " + jqlProject + " AND issuetype in (Bug, Story, Task) AND Sprint in futureSprints() AND \"Story Points\" = null ORDER BY cf[10012] ASC"
            }
          }
        }
      }
      let sheet1, sheet2;
      answers.tabConfirmation === false ? sheet1 = answers.sheet1 : sheet1 = 'Sheet1';
      answers.tabConfirmation === false ? sheet2 = answers.sheet2 : sheet2 = 'Sheet2';

      if (answers.reportType === 'Both') {
        getJiraData(config.searches.current, answers, sheet1);
        getJiraData(config.searches.future, answers, sheet2);
      } else if (answers.reportType === 'PlanITPoker') {
        getJiraData(config.searches.future, answers, sheet2);
      } else {
        getJiraData(config.searches.current, answers, sheet1);
      }

    } else {
      console.error(error(response.statusCode, data.errorMessages));
    }
  });
}

function getJiraData(search, answers, sheetName) {
  client.post("https://theappraisallane.atlassian.net/rest/api/latest/search", search.args, function (searchResult, response) {
    if (response.statusCode === 200) {
      search.type === 'future' ? uploadData = parser.parseFuture(searchResult) : uploadData = parser.parseCurrent(searchResult);
      tester.writeToSheet(uploadData, sheetName, answers.sheetKey);
    }
  });
}