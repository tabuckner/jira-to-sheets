#!/usr/bin/env node

const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const authentication = require("./authentication");
const parser = require('./parser');
const tester = require('./test');
const Client = require('node-rest-client').Client;
let client = new Client();
const config = require('./config/config');

prompt(config.questions)
  .then(answers => {
    inputHandler(answers);
  });

function inputHandler(answers) {
  if (answers.initial === false) {
    if (answers.sheetKey.includes('http')) {
      key = answers.sheetKey.split('/d/');
      answers.sheetKey = key[1].split('/')[0];
    }
    logIn(answers);
  } else {
    authentication.authenticate().then((auth) => {
      console.log('\nAuthentication saved, please restart the tool.\n');
    });
  }
}

function logIn(answers) {
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
              jql: "project = RT AND issuetype in (Bug, Story, Task) AND Sprint in openSprints() ORDER BY cf[10005] DESC"
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
              jql: "project = RT AND issuetype in (Bug, Story, Task) AND Sprint in futureSprints() ORDER BY cf[10005] DESC"
            }
          }
        }
      }

      getJiraData(config.searches.current, answers, 'Sheet1');
      getJiraData(config.searches.future, answers, 'Sheet2');

    } else {
      console.error(response.statusCode, data.errorMessages);
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