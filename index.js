const forge = require('node-forge');
const fetch = require('node-fetch');

const AUTH_REQUEST = 'http://localhost:8888/auth';

module.exports.sha256 = (authToken) => {
  const md = forge.md.sha256.create();
  md.update(authToken + '/users');
  return (hash = md.digest().toHex());
};

module.exports.authFetch = async (URL, n) => {
  const USERS_REQUEST = 'http://localhost:8888/users';
  let authToken = '';

  try {
    const response = await fetch(URL, { method: 'GET' });
    authToken = await response.headers.get('Badsec-Authentication-Token');
    await this.usersFetch(USERS_REQUEST, authToken, 2);
    return response;
  } catch (err) {
    if (n === 0) return console.log('-1');
    return await this.authFetch(URL, n - 1);
  }
};

module.exports.usersFetch = async (URL, authToken, n) => {
  try {
    const response = await fetch(URL, { method: 'GET', headers: { 'X-Request-Checksum': this.sha256(authToken) } });
    const data = await response.text();
    await console.log(data.split('\n'));
    return response;
  } catch (err) {
    if (n === 0) return console.log('-1');
    return await this.usersFetch(URL, authToken, n - 1);
  }
};

this.authFetch(AUTH_REQUEST, 2);
