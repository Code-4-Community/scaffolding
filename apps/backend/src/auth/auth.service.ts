import { Injectable } from '@nestjs/common';
import {
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
  AttributeType,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ListUsersCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import CognitoAuthConfig from './aws-exports';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { createHmac } from 'crypto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { Status } from '../users/types';
import { ConfirmPasswordDto } from './dtos/confirm-password.dto';

@Injectable()
export class AuthService {
  private readonly providerClient: CognitoIdentityProviderClient;
  private readonly clientSecret: string;

  constructor() {
    this.providerClient = new CognitoIdentityProviderClient({
      region: CognitoAuthConfig.region,
      credentials: {
        accessKeyId: process.env.NX_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NX_AWS_SECRET_ACCESS_KEY,
      },
    });

    this.clientSecret = process.env.COGNITO_CLIENT_SECRET;
  }

  /**
   * Computes secret hash to authenticate this backend to Cognito
   * Hash key is the Cognito client secret, message is username + client ID
   * @param username value which depends on the command
   *                 (see https://docs.aws.amazon.com/cognito/latest/developerguide/signing-up-users-in-your-app.html#cognito-user-pools-computing-secret-hash)
   * @returns the HMAC digest of the corresponding username
   * @throws if the HMAC handling interface throws
   */
  calculateHash(username: string): string {
    const hmac = createHmac('sha256', this.clientSecret);
    hmac.update(username + CognitoAuthConfig.clientId);
    return hmac.digest('base64');
  }

  async getUser(userSub: string): Promise<AttributeType[]> {
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: CognitoAuthConfig.userPoolId,
      Filter: `sub = "${userSub}"`,
    });

    // TODO need error handling
    const { Users } = await this.providerClient.send(listUsersCommand);
    return Users[0].Attributes;
  }

  /**
   * A method to create a userin the external auth provider (AWS Cognito)
   * @param signUpDto object containing the necessary fields to create a new user
   * @returns whether or not the user was confirmed as created in the external auth provider
   * @throws whatever the external auth client throws
   */
  async signup(
    { firstName, lastName, email, password }: SignUpDto,
    status: Status = Status.STANDARD,
  ): Promise<boolean> {
    // Needs error handling
    const signUpCommand = new SignUpCommand({
      ClientId: CognitoAuthConfig.clientId,
      SecretHash: this.calculateHash(email),
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'name',
          Value: `${firstName} ${lastName}`,
        },
        // Optional: add a custom Cognito attribute called "role" that also stores the user's status/role
        // If you choose to do so, you'll have to first add this custom attribute in your user pool
        {
          Name: 'custom:role',
          Value: status,
        },
      ],
    });

    const response = await this.providerClient.send(signUpCommand);
    return response.UserConfirmed;
  }

  /**
   * A method to verify a user by email and verificationCode with
   * the external auth provider (AWS Cognito)
   * @param email the email of the user to verify
   * @param verificationCode the code required to verify the user with the external auth provider
   * @throws anything that the external auth provider throws
   */
  async verifyUser(email: string, verificationCode: string): Promise<void> {
    const confirmCommand = new ConfirmSignUpCommand({
      ClientId: CognitoAuthConfig.clientId,
      SecretHash: this.calculateHash(email),
      Username: email,
      ConfirmationCode: verificationCode,
    });

    await this.providerClient.send(confirmCommand);
  }

  /**
   * Method to sign an already existing user into the application with the external auth provider
   * @param signInDto object containing the necessary fields to sign in a user
   * @returns SignInResponseDto with session tokens for the user
   * @throws anything that the external auth provider throws
   */
  async signin({ email, password }: SignInDto): Promise<SignInResponseDto> {
    const signInCommand = new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      ClientId: CognitoAuthConfig.clientId,
      UserPoolId: CognitoAuthConfig.userPoolId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.calculateHash(email),
      },
    });

    const response = await this.providerClient.send(signInCommand);

    return {
      accessToken: response.AuthenticationResult.AccessToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
      idToken: response.AuthenticationResult.IdToken,
    };
  }

  /**
   * Method to refresh a user's session token with the external auth provider
   * @param refreshDto object containing the necessary fields to refresh the token
   * @returns SignInResponseDto with the new (refreshed) session tokens for the user
   * @throws anything that the external auth provider throws
   *
   * Note: Refresh token hash uses a user's sub (unique ID),
   * not their username (typically their email)
   */
  async refreshToken({
    refreshToken,
    userSub,
  }: RefreshTokenDto): Promise<SignInResponseDto> {
    const refreshCommand = new AdminInitiateAuthCommand({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: CognitoAuthConfig.clientId,
      UserPoolId: CognitoAuthConfig.userPoolId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: this.calculateHash(userSub),
      },
    });

    const response = await this.providerClient.send(refreshCommand);

    return {
      accessToken: response.AuthenticationResult.AccessToken,
      refreshToken: refreshToken,
      idToken: response.AuthenticationResult.IdToken,
    };
  }

  /**
   * A method to initiate the process with the external
   * auth provider when the user forgets their password
   * @param body object containing the necessary fields to know which user forgot their password
   * @throws anything that the external auth provider throws
   *
   * Does not return a value.
   */
  async forgotPassword(email: string) {
    const forgotCommand = new ForgotPasswordCommand({
      ClientId: CognitoAuthConfig.clientId,
      Username: email,
      SecretHash: this.calculateHash(email),
    });

    await this.providerClient.send(forgotCommand);
  }

  /**
   * Method to initiate the process with the external
   * auth provider when the user wants to confirm their forgotten password with the system
   * @param body object containing the necessary fields, such as the new password and email, to confirm
   * @throws anything that the external auth provider throws
   *
   * Does not return a value.
   */
  async confirmForgotPassword({
    email,
    confirmationCode,
    newPassword,
  }: ConfirmPasswordDto) {
    const confirmComamnd = new ConfirmForgotPasswordCommand({
      ClientId: CognitoAuthConfig.clientId,
      SecretHash: this.calculateHash(email),
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
    });

    await this.providerClient.send(confirmComamnd);
  }

  /**
   * Method to delete a user by id
   * @param body object containing the necessary fields to delete a user, including id
   * @throws anything that the repository throws.
   *         BadRequestException with a message from the external auth provider.
   *
   * Does not return a value.
   */
  async deleteUser(email: string): Promise<void> {
    const adminDeleteUserCommand = new AdminDeleteUserCommand({
      Username: email,
      UserPoolId: CognitoAuthConfig.userPoolId,
    });

    await this.providerClient.send(adminDeleteUserCommand);
  }
}
