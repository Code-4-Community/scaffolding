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
    // Update with your app's specific name, description, tags, and version
    const config = new DocumentBuilder()
      .setTitle('[YOUR_APP_NAME] API Docs')
      .setDescription('Documentation for [YOUR_APP_NAME] API routes')
      .addBearerAuth()
      .addTag('Users', 'Operations on users')
      .addTag('Auth', 'Operations for authentication')
      // Update with your app's version
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
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
