#!/usr/bin/env node

const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const chalk = require('chalk');
const fs = require('fs');
const log = console.log;
const success = chalk.bold.green;
const error = chalk.bold.red;
const hint = chalk.gray;
const authentication = require("./lib/authentication");
const authenticationLocal = require("./lib/authentication.local");
const atlassianCredsLocal = require('./lib/atlassian');
const parser = require('./lib/parser');
const sheets = require('./lib/sheets');
const Client = require('node-rest-client').Client;
let client = new Client();
const config = require('../config/config');

prompt(config.questions).then(answers => {
  inputHandler(answers);
});

function inputHandler(answers) {
  if (answers.initial === false) {
    answers.sheetKey = cleanURL(answers.sheetKey);
    logIn(answers);
  } else {
    if (answers.storeLocal && answers.storeAtlLocal) {
      authenticationLocal.authenticate().then((auth) => {
        log(success('\nAuthentication and Atlassian Credentials saved ' + success.underline('Locally') + '\n' + success.underline('please restart the tool.') + '\n'));
        setTimeout(() => {
          atlassianCredsLocal.storeCreds(answers.atlUser, answers.atlPassword);
        },1000);
      })
    } else if (answers.storeLocal && !answers.storeAtlLocal) {
      authenticationLocal.authenticate().then((auth) => {
        log(success('\nAuthentication saved ' + success.underline('Locally') + '\n' + success.underline('please restart the tool.') + '\n'));
      })
    } else if (!answers.storeLocal && answers.storeAtlLocal) {
      atlassianCredsLocal.storeCreds(answers.atlUser, answers.atlPassword);
    } else {
      authentication.authenticate().then((auth) => {
        log(success('\nAuthentication saved, ' + success.underline('please restart the tool.') + '\n'));
      });
    }
  }
}

function cleanURL(url) {
  if (url.includes('http')) {
    let key = url.split('/d/');
    return key[1].split('/')[0];
  } else {
    return url;
  }
}

function logIn(answers) { // TODO: Refactor as log in prep and use Async Await to ensure synchronous
  config.jqlProject = ''; // TODO: Move this var to the config.
  answers.project === 'CORE & TBN' ? config.jqlProject = 'CORE, TBN' : (answers.project === 'User Defined' ? config.jqlProject = answers.userProject : config.jqlProject = answers.project);
  config.loginArgs = {
    headers: {
      "Content-Type": "application/json"
    },
    data: {}
  }

  if (answers.atlUser === '' && answers.atlPassword === '') {
    let savedCreds = atlassianCredsLocal.readCreds();
    config.loginArgs.data = {
      "username": savedCreds.user,
      "password": savedCreds.pass,
    };
  } else {
    if (config.default.user && answers.atlUser !== config.default.user) {
      config.loginArgs.data.username = answers.atlUser;
      config.loginArgs.data.password = answers.atlPassword;
    }
    config.loginArgs.data = {
      "username": answers.atlUser,
      "password": answers.atlPassword
    }
  }

  client.post("https://theappraisallane.atlassian.net/rest/auth/1/session", config.loginArgs, function (data, response) {
    if (response.statusCode == 200) { // TODO: Move all of this to a new organized response hanlder function
      saveCookie(data.session, answers.isTalEmployee);
      reportLogic(answers/* , keyStoredLocally */);
    } else {
      console.error(error(response.statusCode, data.errorMessages));
    }
  });
}

function getJiraData(search, answers, sheetName, operation/* , keyStoredLocally */) {
  client.post("https://theappraisallane.atlassian.net/rest/api/latest/search", search.args, function (searchResult, response) {
    if (response.statusCode === 200) {
      search.type === 'future' ? uploadData = parser.parseFuture(searchResult) : uploadData = parser.parseCurrent(searchResult);
      operation === 'Update Existing Sheet(s)' ? sheets.updateSheet(uploadData, sheetName, answers.sheetKey, answers.exceptions, answers.keyIndex/* , keyStoredLocally */) : sheets.writeToSheet(uploadData, sheetName, answers.sheetKey/* , keyStoredLocally */);
    }
  });
}

function reportLogic(answers/* , keyStoredLocally */) {
  if (answers.reportType === 'Both') {
    getJiraData(config.searches.current, answers, answers.sheet1, answers.operation/* , keyStoredLocally */);
    getJiraData(config.searches.future, answers, answers.sheet2, answers.operation/* , keyStoredLocally */);
  } else if (answers.reportType === 'PlanITPoker') {
    getJiraData(config.searches.future, answers, answers.sheet2, answers.operation/* , keyStoredLocally */);
  } else {
    getJiraData(config.searches.current, answers, answers.sheet1, answers.operation/* , keyStoredLocally */);
  }
}

function saveCookie(cookie, isTALEmployee) {
  config.session = cookie;
  config.searches = {
    current: {
      type: 'current',
      args: {
        headers: {
          cookie: config.session.name + '=' + config.session.value, // Set the cookie from the session information
          "Content-Type": "application/json"
        },
        data: {}
      }
    },
    future: {
      type: 'future',
      args: {
        headers: {
          cookie: config.session.name + '=' + config.session.value,
          "Content-Type": "application/json"
        },
        data: {}
      }
    }
  }
  if (isTALEmployee) {
    config.searches.current.args.data = {
      jql: "project in (" + config.jqlProject + ") AND issuetype in (Bug, Story, Task) AND Sprint in openSprints() ORDER BY cf[10012] ASC"
    };
    config.searches.future.args.data = {
      jql: "project in (" + config.jqlProject + ") AND issuetype in (Bug, Story, Task) AND Sprint in futureSprints() AND \"Story Points\" = null ORDER BY cf[10012] ASC"
    }
  } else {
    config.searches.current.args.data = {
      jql: "project in (" + config.jqlProject + ") AND issuetype in (Bug, Story, Task) AND Sprint in openSprints()"
    };
    config.searches.future.args.data = {
      jql: "project in (" + config.jqlProject + ") AND issuetype in (Bug, Story, Task) AND Sprint in futureSprints()"
    }
  }
}
