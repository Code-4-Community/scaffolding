import { Injectable } from '@nestjs/common';
import {
  AdminDeleteUserCommand,
  AttributeType,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import CognitoAuthConfig from '../../../shared/aws-exports';

@Injectable()
export class AuthService {
  private readonly providerClient: CognitoIdentityProviderClient;

  constructor() {
    this.providerClient = new CognitoIdentityProviderClient({
      region: CognitoAuthConfig.aws_cognito_region,
      credentials: {
        accessKeyId: process.env.NX_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NX_AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async getUser(userSub: string): Promise<AttributeType[]> {
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: CognitoAuthConfig.aws_user_pools_id,
      Filter: `sub = "${userSub}"`,
    });

    // TODO need error handling
    const { Users } = await this.providerClient.send(listUsersCommand);
    return Users[0].Attributes;
  }


  // TODO: add create user function for admin members

  
  async deleteUser(email: string): Promise<void> {
    const adminDeleteUserCommand = new AdminDeleteUserCommand({
      Username: email,
      UserPoolId: CognitoAuthConfig.aws_user_pools_id,
    });

    await this.providerClient.send(adminDeleteUserCommand);
  }
}
