/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import * as dynamoose from 'dynamoose';

import { AppModule } from './app.module';

async function bootstrap() {
  // Create new DynamoDB instance
  const ddb = new dynamoose.aws.ddb.DynamoDB({
    credentials: {
      accessKeyId: process.env.NX_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NX_AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  // Set DynamoDB instance to the Dynamoose DDB instance
  dynamoose.aws.ddb.set(ddb);

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Scaffolding API Docs')
    .setDescription('Documentation for the scaffolding REST API routes')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
