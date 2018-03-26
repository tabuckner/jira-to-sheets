const google = require('googleapis');
const chalk = require('chalk');
const authentication = require("./authentication");
const authenticationLocal = require("./authentication.local");
const updater = require('./update');
const helpers = require('./helpers');
const sheets = google.sheets('v4');
const fs = require('fs');
const os = require('os');
const path = require('path');
// let keyStoredLocally = undefined;
const TOKEN_DIR = `${os.homedir()}/.j2s`;
const TOKEN_PATH = path.resolve(TOKEN_DIR, 'sheets.google.token.json');


function writeToSheet(data, sheet, key) {
  if (!checkGoogleAuthExists) {
    authentication.authenticate().then((auth) => {
      writeSheet(auth, data, sheet, key);
    });
  } else {
    authenticationLocal.authenticate().then((auth) => {
      writeSheet(auth, data, sheet, key);
    });
  }
}

function updateSheet(data, sheet, key, exceptionStr, keyIndexStr) { // TODO: Add support for Destructive and Non-Destructive updates (separate sheet).
  let exceptions = helpers.colToindex(exceptionStr);
  let keyIndex = helpers.colToindex(keyIndexStr); // TODO: Move this to a question for more exn
  console.log(chalk.gray.underline('New Data Length:', data.length)); // we have
  if (!checkGoogleAuthExists) {
    authentication.authenticate().then((auth) => {
      readSheet(auth, sheet, key)
        .then(existing => {
          console.log(chalk.gray.underline('Existing Data Length:', existing.length));
          let updatedDataSet = updater.updateData(existing, data, exceptions, keyIndex); // function updateData(oldData, newData, exceptionArr, keyIndex)
          let updatedData = updatedDataSet.output;
          console.log(chalk.gray.underline('New Rows Found:', updatedDataSet.newRows));
          console.log(chalk.green.underline('Updated Data Length:', updatedData.length));
          clearSheet(auth, sheet, key); // function clearSheet(auth, sheet, key)
          writeSheet(auth, updatedData, sheet, key);
        });
    });
  } else {
    authenticationLocal.authenticate().then((auth) => {
      readSheet(auth, sheet, key)
        .then(existing => {
          console.log(chalk.gray.underline('Existing Data Length:', existing.length));
          let updatedDataSet = updater.updateData(existing, data, exceptions, keyIndex); // function updateData(oldData, newData, exceptionArr, keyIndex)
          let updatedData = updatedDataSet.output;
          console.log(chalk.gray.underline('New Rows Found:', updatedDataSet.newRows));
          console.log(chalk.green.underline('Updated Data Length:', updatedData.length));
          clearSheet(auth, sheet, key); // function clearSheet(auth, sheet, key)
          writeSheet(auth, updatedData, sheet, key);
        });
    });
  }
}

function clearSheet(auth, sheet, key) {
  // Range Format: 'Sheet One'!A1:B2
  sheets.spreadsheets.values.clear({
    auth: auth,
    spreadsheetId: key,
    range: "'" + sheet + "'!A1:Z9999", // This is dumb. Fix this. Ya Dingus.
  }, (err, response) => {
    if (err) {
      console.error(err);
    } else {
      console.log(chalk.gray(sheet, 'Cleared'));
    }
  });
}

function writeSheet(auth, data, sheet, key) {
  sheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: key,
    range: sheet,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: data
    }
  }, (err, response) => {
    if (err) {
      console.error(err);
    } else {
      console.log(chalk.green(sheet, "Appended"));
    }
  });
}

function readSheet(auth, sheet, key) {
  return new Promise(function (resolve, reject) {
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: key,
      range: sheet,
    }, (err, response) => {
      if (err) {
        console.error(err);
      } else {
        let rows = response.values;
        if (rows.length === 0) {
          reject('No Data Found.')
        } else {
          let clean = [];
          for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            clean.push(row);
          }
          resolve(clean);
        }
      }
    });
  });
}

function checkGoogleAuthExists() {
  let googleAuthExists = undefined;
  fs.existsSync(TOKEN_PATH) ? googleAuthExists = true : googleAuthExists = false;
  return googleAuthExists;
}

module.exports = {
  writeToSheet: writeToSheet,
  updateSheet: updateSheet
}
