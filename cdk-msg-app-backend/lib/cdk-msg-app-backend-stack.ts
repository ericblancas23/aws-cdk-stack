import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as ecr from 'aws-cdk-lib/aws-ecr'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkMsgAppBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkMsgAppBackendQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    const table = new dynamodb.Table(this, 'Message', {
      partitionKey: {
        name: 'app_id',
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.NUMBER
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    });
    new CfnOutput(this, 'TableName', { value: table.tableName});

    const vpc = new ec2.Vpc(this, 'workshop-vpc', {
      cidr: '10.1.0.0/16',
      natGateways: 1,
      subnetConfiguration: [
        { cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC, name: "Public"},
        { cidrMask: 24, subnetType: ec2.SubnetType.PRIVATE_ISOLATED, name: 'Private'}
      ],
      maxAzs: 3
    });

    const repository = new ecr.Repository(this, "workshop", {
      repositoryName: "workshop-api"
    });
  }
}
