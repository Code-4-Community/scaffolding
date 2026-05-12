/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  if (process.env.SWAGGER_ENABLED === 'TRUE') {
    const config = new DocumentBuilder()
      // Update with your app's specific name
      .setTitle('[YOUR_APP_NAME] API Docs')
      // Update with your app's specific description
      .setDescription('Documentation for [YOUR_APP_NAME] API routes')
      // Add bearer auth for protected routes (Use @ApiBearerAuth() decorator on the controller for the routes that should be protected)
      .addBearerAuth()
      // Example tag for a users controller
      .addTag('Users', 'Operations on users')
      // Update with your app's version
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config); // Create the Swagger document
    SwaggerModule.setup('api', app, document); // Setup the Swagger module
    Logger.log(
      `😎 Swagger is enabled and will be available at: http://localhost:${
        process.env.PORT || 3000
      }/api`,
    );
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
