import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Public } from './aws/cognito/cognito.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Scaffold smoke-test route. Marked @Public() so it answers whether or not
   * Cognito is configured -- it is the request the frontend fires on mount.
   *
   * Delete @Public() (or this route) once you have real endpoints: every route
   * is protected by default, and this decorator is the only way to opt out.
   */
  @Public()
  @Get()
  getData() {
    return this.appService.getData();
  }
}
