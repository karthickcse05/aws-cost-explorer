import AWS from 'aws-sdk';

export async function getAccountAlias(): Promise<string> {
    const iam = new AWS.IAM();
    const accountAliases = await iam.listAccountAliases().promise();
    const foundAlias = accountAliases?.['AccountAliases']?.[0];
  
    if (foundAlias) {
      return foundAlias;
    }
  
    const sts = new AWS.STS();
    const accountInfo = await sts.getCallerIdentity().promise();
    return accountInfo?.Account || '';
  }