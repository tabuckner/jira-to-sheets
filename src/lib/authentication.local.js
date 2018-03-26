const fs = require('fs');
const os = require('os');
const chalk = require('chalk');
const success = chalk.bold.green;
const error = chalk.bold.red;
const hint = chalk.gray;
let readline = require('readline');
let googleAuth = require('google-auth-library');
let path = require('path');
const opn = require('opn');
let SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_DIR = `${os.homedir()}/.j2s`; // Updated 3/22 for locally stored tokens
// // const TOKEN_DIR = path.resolve(__dirname, '../../config/'); //the directory where we're going to save the token
const TOKEN_PATH = path.resolve(TOKEN_DIR, 'sheets.google.token.json'); //the file which will contain the token

class AuthenticationLocal {
  authenticate() {
    return new Promise((resolve, reject) => {
      let credentials = this.getClientSecret();
      let authorizePromise = this.authorize(credentials);
      authorizePromise.then(resolve, reject);
    });
  }
  getClientSecret() {
    return require('../../config/credentials.json');
  }
  authorize(credentials) {
    let clientSecret = credentials.installed.client_secret;
    let clientId = credentials.installed.client_id;
    let redirectUrl = credentials.installed.redirect_uris[0];
    let auth = new googleAuth();
    let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    return new Promise((resolve, reject) => {
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          this.getNewToken(oauth2Client).then((oauth2ClientNew) => {
            resolve(oauth2ClientNew);
          }, (err) => {
            reject(err);
          });
        } else {
          oauth2Client.credentials = JSON.parse(token);
          resolve(oauth2Client);
        }
      });
    });
  }
  getNewToken(oauth2Client, callback) {
    return new Promise((resolve, reject) => {
      let authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      });
      console.log(hint('Opening Authorization Service in Default Browser'));
      opn(authUrl);
      let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('\n\nEnter the code from that page here: ', (code) => {
        rl.close();
        oauth2Client.getToken(code, (err, token) => {
          if (err) {
            console.log(error('Error while trying to retrieve access token', err));
            reject();
          }
          oauth2Client.credentials = token;
          this.storeToken(token);
          resolve(oauth2Client);
        });
      });
    });
  }
  storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) {
        throw err;
      } else {
        console.log(hint('Token stored to ' + TOKEN_PATH));
        // process.exit(0); // TODO: Move this to main logic file to prevent user from restarting tool. 
      }
    });
  }
}

module.exports = new AuthenticationLocal();
