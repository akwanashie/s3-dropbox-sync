const { Dropbox } = require('dropbox');
const { readFileSync } = require('fs');

const dropboxClient = new Dropbox({ accessToken: process.env.DBX_TOKEN });
const dropboxFolderPath = '/foreign-folders/s3'
async function viewS3Folder() {
  const folderList = (await dropboxClient.filesListFolder({ path: dropboxFolderPath })).result.entries;
  return folderList.map(fileInfo => fileInfo.name);
}

async function saveFileToS3Folder(content, fileName) {
  const data = await dropboxClient.filesUpload({
    contents: content,
    path: `${dropboxFolderPath}/${fileName}`,
    mode: { '.tag': 'overwrite' }
  });
 return data.result.path_lower;
}

// viewS3Folder()
//   .then(console.log)
//   .catch(console.log);

// saveFileToS3Folder('This is a test 123', 'test.txt')
//   .then(console.log)
//   .catch(console.log);