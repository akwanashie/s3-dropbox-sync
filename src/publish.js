const { Dropbox } = require('dropbox');
const S3 = require('aws-sdk/clients/s3');

const dropboxClient = new Dropbox({ accessToken: process.env.DBX_TOKEN });
const dropboxFolderPath = '/foreign-folders/s3'

const s3Client = new S3();
const s3Bucket = 'akwanashie-shared-files'
const maxFileSize = 157286400;

async function getDropboxFiles() {
  // const folderList = (await dropboxClient.filesListFolder({ path: dropboxFolderPath })).result.entries;
  // return folderList.map(fileInfo => fileInfo.name);
  return [ 'ccomments2.png' ];
}

// async function saveFileToDropbox(content, fileName) {
//   const data = await dropboxClient.filesUpload({
//     contents: content,
//     path: `${dropboxFolderPath}/${fileName}`,
//     mode: { '.tag': 'overwrite' }
//   });
//  return data.result.path_lower;
// }

async function saveToDropbox(files) {
  if (files === []) {
    return;
  }

  const nextFile = files.shift();
  const s3File = await downloadFromS3(nextFile);
  await dropboxClient.filesUpload({
    contents: s3File.Body,
    path: `${dropboxFolderPath}/${nextFile}`,
    mode: { '.tag': 'overwrite' }
  });

  await saveToDropbox(files);
}

async function getS3Files() {
  const data = await s3Client.listObjects({ Bucket: s3Bucket }).promise();
  const validFilesInfo = data.Contents.filter(info => {
    if (info.Size > 1048576) {
      console.log(`File ${info.Key} is too large to copy. Ignoring...`);
      return false;
    }
    return true;
  });
  return validFilesInfo.map((fileInfo) => fileInfo.Key);
}

async function downloadFromS3(fileName) {
  const data = await s3Client.getObject({ Bucket: s3Bucket, Key: fileName }).promise();
  return data;
}

async function run() {
  const s3Files = await getS3Files();
  const dropBoxFiles = await getDropboxFiles();
  const files = s3Files.filter((file) => !dropBoxFiles.includes(file));
  return await saveToDropbox(files);
}

run()
  .then(console.log)
  .catch(console.log);