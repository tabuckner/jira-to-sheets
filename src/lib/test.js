const google = require('googleapis');
const authentication = require("./authentication");
const updater = require('./update');
const sheets = google.sheets('v4');
// let testRow = ['Typo in the menu("Arbitrations")', 'Bug', 'CORE-438', 'To Build', '', 'edashkovsky', '', '', '', 'iOS']

// updateSheet(testRow, 'Sheet1', '1bkeKHp4pA4-nzf2oZktIdS_CDIcl_FGXpZd0THtJooY');

function writeToSheet(data, sheet, key) {
  authentication.authenticate().then((auth) => {
    writeSheet(auth, data, sheet, key);
  });
}

function updateSheet(data, sheet, key) {
  // hardcoded params for testing
  testExceptions = [7, 8]; // TODO: Write new question
  testKeyIndex = 3; // TODO: Write new question
  console.log('New Data Length', data.length); // we have

  authentication.authenticate().then((auth) => {
    readSheet(auth, sheet, key)
      .then(existing => {
        console.log('Existing Data Length', existing.length);
        let updatedData = updater.updateData(existing, data, testExceptions, testKeyIndex); // function updateData(oldData, newData, exceptionArr, keyIndex)
        console.log('Updated Data Length', updatedData.length);
        clearSheet(auth, 'Sheet2', key); // function clearSheet(auth, sheet, key)
        writeSheet(auth, updatedData, 'Sheet2', key);
      });
  });
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
      console.log(sheet, 'Cleared');
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
      console.log(sheet, "Appended");
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

module.exports = {
  writeToSheet: writeToSheet,
  updateSheet: updateSheet
}
