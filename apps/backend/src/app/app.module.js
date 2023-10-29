import { __decorate } from 'tslib';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PluralNamingStrategy } from '../strategies/plural-naming.strategy';
let AppModule = class AppModule {};
AppModule = __decorate(
  [
    Module({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mongodb',
          host: '127.0.0.1',
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
      ],
      controllers: [AppController],
      providers: [AppService],
    }),
  ],
  AppModule,
);
export { AppModule };
//# sourceMappingURL=app.module.js.map
