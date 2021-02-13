const { Dropbox } = require('dropbox');
const S3 = require('aws-sdk/clients/s3');

const dropboxClient = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });
const dropboxFolderPath = process.env.DROPBOX_FOLDER; //'/foreign-folders/s3'

const s3Client = new S3();
const s3Bucket = process.env.S3_BUCKET; //'akwanashie-shared-files'
const maxFileSize = 157286400;

async function getDropboxFiles() {
  const folderList = (await dropboxClient.filesListFolder({ path: dropboxFolderPath })).result.entries;
  return folderList.map(fileInfo => fileInfo.name);
}

async function saveToDropbox(files) {
  if (files.length == 0) {
    return;
  }

  const nextFile = files.shift();
  const s3File = await downloadFromS3(nextFile);
  console.log(`Downloaded ${nextFile} from s3`);

  const data = await dropboxClient.filesUpload({
    contents: s3File.Body,
    path: `${dropboxFolderPath}/${nextFile}`,
    mode: { '.tag': 'overwrite' }
  });
  console.log(`Saved ${data.result.path_lower} to Dropbox`);

  await saveToDropbox(files);
}

async function getS3Files() {
  const data = await s3Client.listObjects({ Bucket: s3Bucket }).promise();
  const validFilesInfo = data.Contents.filter(info => {
    if (info.Size > maxFileSize) {
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

module.exports = {
  handler: async function(event) {
    return await run()
      .catch(console.log);
  }
}