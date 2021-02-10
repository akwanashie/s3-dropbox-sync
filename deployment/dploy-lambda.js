const lambda = require('@aws-cdk/aws-lambda');
const { ManagedPolicy } = require('@aws-cdk/aws-iam');
const cdk = require('@aws-cdk/core');
const path = require('path');

class LambdaStack extends cdk.Stack {
  constructor(app, id) {
    super(app, id);

    const lambdaFn = new lambda.Function(this, 'S3ToDropBoxSync', {
      code: lambda.Code.fromAsset(path.join(__dirname, '/../s3-dropbox-sync')),
      handler: 'publish.handler',
      timeout: cdk.Duration.seconds(300),
      runtime: lambda.Runtime.NODEJS_10_X,
    });
    
    lambdaFn.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"));
  }
}

const app = new cdk.App();
new LambdaStack(app, 'S3ToDropBoxSync');
app.synth();