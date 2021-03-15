const forge = require('node-forge');
const fetch = require('node-fetch');

const AUTH_REQUEST = 'http://localhost:8888/auth';
const REQUESTED_PATH = '/users';

//Create SHA-256 hex hash for authentication token and '/users' requested path
module.exports.sha256 = (authToken) => {
  const md = forge.md.sha256.create();
  md.update(authToken + REQUESTED_PATH);
  return (hash = md.digest().toHex());
};

//Main API call
module.exports.authFetch = async (URL, n) => {
  const USERS_REQUEST = 'http://localhost:8888/users';
  let authToken = '';

  try {
    const response = await fetch(URL, { method: 'GET' });
    //Collect authentication token in 'Badsec-Authentication-Token' HTTP header
    authToken = await response.headers.get('Badsec-Authentication-Token');
    //Once auth token received, call another API call
    await this.usersFetch(USERS_REQUEST, authToken, 2);
    return response;
  } catch (err) {
    if (n === 0) return console.log('-1');
    //If connection issues, recursively call API call for up to n times
    return await this.authFetch(URL, n - 1);
  }
};

//An API call with hashed token + request path added to 'X-Request-Checksum' HTTP header
module.exports.usersFetch = async (URL, authToken, n) => {
  try {
    const response = await fetch(URL, { method: 'GET', headers: { 'X-Request-Checksum': this.sha256(authToken) } });
    const data = await response.text();
    //  Produce result in json format
    await console.log(data.split('\n'));
    return response;
  } catch (err) {
    if (n === 0) return console.log('-1');
    //If connection issues, recursively call API call for up to n times
    return await this.usersFetch(URL, authToken, n - 1);
  }
};

//Execute API call
this.authFetch(AUTH_REQUEST, 2);
