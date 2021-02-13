## s3-dropbox-publisher

Fetch files from a configured s3 path and save to Dropbox.

### Running locally

You could run the s3/dropbox sync script locally (as long as your network allows connection to both AWS and Dropbox APIs).

- In the `lib`  folder, install dependencies:

  ```bash
    cd lib
    npm install
  ```

- Define the following environment variabales:

  | Environmet variable   |  Required?  | Description |
  | ----------------------| ------------| ------------|
  | AWS_ACCESS_KEY_ID     | Yes         | Should have read/write s3 permissions |
  | AWS_SECRET_ACCESS_KEY | Yes         | Should have read/write s3 permissions |
  | DROPBOX_TOKEN | Yes         | Should have read/write dropbox permissions |
  | DROPBOX_FOLDER | Yes         | For example `/my-folders/work/s3-files` |
  | S3_BUCKET | Yes         | For example `my-s3-bucket` |

- Run the script;

  ```bash
  ./run.js
  ```

### Deploying the Lambda

You could set this up as an AWS lamabda that can be triggered manually or on a regular interval.

- Define the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` env variabales with the right s3 and cloudformation permissions.

- In the `lambda`  folder, install dependencies:

  ```bash
  cd lambda
  npm install
  ```

- Show CDK diff

  ```bash
  ./node_modules/.bin/cdk diff -a "node deploy-lambda.js"
  ```

- Deploy

  ```bash
  ./node_modules/.bin/cdk deploy -a "node deploy-lambda.js"
  ```

- On the AWS CLI, set the `DROPBOX_TOKEN` environment variables required to execute the sync.

- You can also execute the lambda locally by running the `./scripts/trigger-sync-lambda.sh` script.