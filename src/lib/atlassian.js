const fs = require('fs');
const os = require('os');
let path = require('path');
const chalk = require('chalk');
const success = chalk.bold.green;
const error = chalk.bold.red;
const hint = chalk.gray;
const CREDS_DIR = `${os.homedir()}/.j2s`;
const TOKEN_PATH = path.resolve(CREDS_DIR, 'sheets.google.token.json');
const CREDS_PATH = path.resolve(CREDS_DIR, '.atlassian.creds');


class AtlassianCredsLocal {
  storeCreds(user, password) {
    let key = this.getKey(TOKEN_PATH);
    const encryptor = require('simple-encryptor')(key);
    console.log(hint(`Attempting to store ${user}'s credentials.`));
    let credsObj = {
      user: user,
      pass: password,
    };
    let encCredsObj = encryptor.encrypt(credsObj);
  
    try {
      fs.mkdirSync(CREDS_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }

    fs.writeFile(CREDS_PATH, encCredsObj, 'utf8', (err) => {
      if (err) {
        throw err;
      } else {
        console.log(hint('Credentials stored at ' + CREDS_PATH));
        // process.exit(0); // TODO: Move this to main logic file to prevent user from restarting tool. 
      }
    });
  }

  readCreds() {
    let key = this.getKey(TOKEN_PATH);
    const encryptor = require('simple-encryptor')(key);
    console.log(hint('Attempting to pull saved Atlassian Credentials.'));
    if (fs.existsSync(CREDS_PATH)) {
      let readCreds = fs.readFileSync(CREDS_PATH, 'utf8')
      // console.log(CREDS_PATH);
      let decCreds = encryptor.decrypt(readCreds);
      return decCreds; // { user: <user>, pass: <pass> }
    } else {
      console.log(error(`No Atlassian Credentials found at ${CREDS_DIR}`));
      console.log(hint('You can likely resolve this by Selecting \'Yes\' at \'Is this your first time using the tool?\''));
      return false; // TODO: Should I use a faked return structure? { user: '', pass: '' }
    }
  }

  getKey(path) {
    if (fs.existsSync(path)) {
      let token = fs.readFileSync(path);
      let key = JSON.parse(token).access_token;
      return key;
    } else {
      console.log(hint('Encryption key not found.'));
      return 'notasecurestringandimlazy'; // TODO: Return False?
    }
  }
}


module.exports = new AtlassianCredsLocal();
