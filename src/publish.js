const { Dropbox } = require('dropbox');

const dropboxClient = new Dropbox({ accessToken: process.env.TOKEN });

dropboxClient.filesListFolder({ path: '' })
  .then(console.log)
  .catch(console.log);