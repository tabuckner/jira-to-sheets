const google = require('googleapis');
const authentication = require("./authentication");
const sheets = google.sheets('v4');

function writeToSheet(data, sheet, key) {
  authentication.authenticate().then((auth) => {
    writeSheet(auth, data, sheet, key);
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

module.exports = {
  writeToSheet: writeToSheet
}
