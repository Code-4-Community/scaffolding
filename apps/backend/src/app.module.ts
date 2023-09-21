import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PluralNamingStrategy } from './strategies/plural-naming.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'scaffoldingTest',
      // username: 'root',
      // password: 'root',
      autoLoadEntities: true,
      // entities: [join(__dirname, '**/**.entity.{ts,js}')],
      // Setting synchronize: true shouldn't be used in production - otherwise you can lose production data
      synchronize: true,
      namingStrategy: new PluralNamingStrategy(),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
