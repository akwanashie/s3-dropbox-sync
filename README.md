## s3-dropbox-publisher

Fetch files from a configured s3 path and save to Dropbox.

### Deployment

- Install dependencies

  ```bash
  cd deployment
  npm install
  ```

- Show CDK diff

  ```bash
  ./node_modules/.bin/cdk diff -a "node dploy-lambda.js"
  ```

- Deploy

  ```bash
  ./node_modules/.bin/cdk deploy -a "node dploy-lambda.js"
  ```