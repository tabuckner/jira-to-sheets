const google = require('googleapis');
const authentication = require("./authentication");
const sheets = google.sheets('v4');
let testRow = ['Typo in the menu("Arbitrations")', 'Bug', 'CORE-438', 'To Build', '', 'edashkovsky', '', '', '', 'iOS']

readFromSheet('Sheet1', '1bkeKHp4pA4-nzf2oZktIdS_CDIcl_FGXpZd0THtJooY');

function writeToSheet(data, sheet, key) {
  authentication.authenticate().then((auth) => {
    writeSheet(auth, data, sheet, key);
  });
}

function updateSheet(data, sheet, key) {
  authentication.authenticate().then((auth) => {
    readSheet(auth, sheet, key)
      .then(response => {
        let existing = response;
        console.log(existing);
      });
  });
}

function findMatchingRows(arrA, arrB, keyIndex) {
  let matches = [];
  let pair = {};
  for (bIndex = 0; bIndex < arrB.length; bIndex++) {
    let keyValue = arrB[bIndex][keyIndex];
    for (aIndex = 0; aIndex < arrA.length; aIndex++) {
      if (arrA[aIndex][keyIndex] === arrB[bIndex][keyIndex]) {
        pair = { b: bIndex, a: aIndex };
        matches.push(pair);
      }
    }
  }
  return matches;
}

function updateRow(old, notOld, exceptions) {
  for (i = 0; i < old.length; i++) {
    if (old[i] !== notOld[i] && checkExceptions(exceptions, i) !== true) {
      old[i] = notOld[i];
    }
  }
  alert(old);
}

function checkExceptions(exceptionArr, testVal) {
  return exceptionArr.some(arrVal => testVal === arrVal);
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

    // let shit = [];
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
          // console.warn('No data found.');
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
  readFromSheet: readFromSheet
}
