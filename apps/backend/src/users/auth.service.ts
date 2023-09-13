import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

import { scrypt as _scrypt } from 'crypto';
import CognitoAuthConfig from './aws-exports';

@Injectable()
export class AuthService {
  private readonly userPool: CognitoUserPool;
  private readonly providerClient: CognitoIdentityProviderClient;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: CognitoAuthConfig.userPoolId,
      ClientId: CognitoAuthConfig.clientId,
    });

    this.providerClient = new CognitoIdentityProviderClient({
      region: CognitoAuthConfig.region,
    });
  }

  // async signup(email: string, password: string) {
  //   // 1. See if email is in use
  //   const users = await this.usersService.find(email);
  //   if (users.length) {
  //     throw new BadRequestException('Email in use');
  //   }

  //   // 2. Hash the user's password
  //   // Generate a salt
  //   const salt = randomBytes(8).toString('hex'); // 16 characters/numbers long
  //   // Hash the salt and the password together
  //   const hash = (await scrypt(password, salt, 32)) as Buffer; // 32 is the length of the key
  //   // Join the hashed result and the salt together
  //   const result = salt + '.' + hash.toString('hex');

  //   // 3. Create a new user and save it
  //   const user = await this.usersService.create(email, result);

  //   // 4. Return the user
  //   return user;
  // }

  // async signin(email: string, password: string) {
  //   const [user] = await this.usersService.find(email);

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const [salt, storedHash] = user.password.split('.');

  //   const hash = (await scrypt(password, salt, 32)) as Buffer;

  //   if (storedHash !== hash.toString('hex')) {
  //     throw new BadRequestException('Bad password');
  //   }

  //   return user;
  // }

  signup(email: string, password: string): Promise<ISignUpResult> {
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  verifyUser(email: string, verificationCode: string) {
    return new Promise((resolve, reject) => {
      return new CognitoUser({
        Username: email,
        Pool: this.userPool,
      }).confirmRegistration(verificationCode, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  signin(email: string, password: string) {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise<CognitoUserSession>((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  forgotPassword(email: string) {
    return new Promise((resolve, reject) => {
      return new CognitoUser({
        Username: email,
        Pool: this.userPool,
      }).forgotPassword({
        onSuccess: function (result) {
          resolve(result);
        },
        onFailure: function (err) {
          reject(err);
        },
      });
    });
  }

  confirmPassword(
    email: string,
    verificationCode: string,
    newPassword: string
  ) {
    return new Promise((resolve, reject) => {
      return new CognitoUser({
        Username: email,
        Pool: this.userPool,
      }).confirmPassword(verificationCode, newPassword, {
        onSuccess: function (result) {
          resolve(result);
        },
        onFailure: function (err) {
          reject(err);
        },
      });
    });
  }

  async deleteUser(email: string) {
    const adminDeleteUserCommand = new AdminDeleteUserCommand({
      Username: email,
      UserPoolId: CognitoAuthConfig.userPoolId,
    });

    await this.providerClient.send(adminDeleteUserCommand);
  }
}
