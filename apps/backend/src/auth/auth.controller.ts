import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { VerifyUserDto } from './dtos/verify-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { User } from '../users/user.entity';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfirmPasswordDto } from './dtos/confirm-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';

/**
 * Controller to expose callable HTTP endpoints to handle user authentication, including signup and login
 */
@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(CurrentUserInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  /**
   * Exposes an endpoint to create a user
   * @param signUpDto object containing the necessary fields to create a new user
   * @returns object of the newly created user
   * @throws BadRequestException if signup fails in the external auth client (in this case, AWS Cognito)
   *         Also will throw if the repository throws upon user creation.
   */
  @Post('/signup')
  async createUser(@Body() signUpDto: SignUpDto): Promise<User> {
    // By default, creates a standard user
    try {
      await this.authService.signup(signUpDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    const user = await this.usersService.create(
      signUpDto.email,
      signUpDto.firstName,
      signUpDto.lastName,
    );

    return user;
  }

  /**
   * Exposes an endpoint to verify the user in the external auth service (in this case, AWS Cognito)
   * @param body object containing the necessary fields to verify a user
   * @throws BadRequestException with message thrown from external auth service
   *
   * Does not return a value.
   */
  // TODO deprecated if verification code is replaced by link
  @Post('/verify')
  verifyUser(@Body() body: VerifyUserDto): void {
    try {
      this.authService.verifyUser(body.email, body.verificationCode);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  /**
   * Exposes an endpoint to sign an already existing user into the application
   * @param signInDto object containing the necessary fields to sign in a user
   * @returns SignInResponseDto with session tokens for the user
   * @throws anything that the external auth provider throws
   */
  @Post('/signin')
  signin(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signin(signInDto);
  }

  /**
   * Exposes an endpoint to refresh a user's session token with the external auth provider
   * @param refreshDto object containing the necessary fields to refresh the token
   * @returns SignInResponseDto with the new (refreshed) session tokens for the user
   * @throws anything that the external auth provider throws
   */
  @Post('/refresh')
  refresh(@Body() refreshDto: RefreshTokenDto): Promise<SignInResponseDto> {
    return this.authService.refreshToken(refreshDto);
  }

  /**
   * Exposes an endpoint to initiate the process with the external
   * auth provider when the user forgets their password
   * @param body object containing the necessary fields to know which user forgot their password
   * @throws anything that the external auth provider throws
   *
   * Does not return a value.
   */
  @Post('/forgotPassword')
  forgotPassword(@Body() body: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(body.email);
  }

  /**
   * Exposes an endpoint to initiate the process with the external
   * auth provider when the user wants to confirm their password with the system
   * @param body object containing the necessary fields, such as the new password and email, to confirm
   * @throws anything that the external auth provider throws
   *
   * Does not return a value.
   */
  @Post('/confirmPassword')
  confirmPassword(@Body() body: ConfirmPasswordDto): Promise<void> {
    return this.authService.confirmForgotPassword(body);
  }

  /**
   * Exposes an endpoing to delete a user by id
   * @param body object containing the necessary fields to delete a user, including id
   * @throws anything that the repository throws.
   *         BadRequestException with a message from the external auth provider.
   *
   * Does not return a value.
   */
  @Post('/delete')
  async delete(@Body() body: DeleteUserDto): Promise<void> {
    const user = await this.usersService.findOne(body.userId);

    try {
      await this.authService.deleteUser(user.email);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    this.usersService.remove(user.id);
  }
}
