import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SiteModule } from '../site/site.module';
import { DynamoDbService } from '../dynamodb';


@Module({
<<<<<<< HEAD
  imports: [UserModule
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   host: '127.0.0.1',
    //   port: 27017,
    //   database: 'scaffoldingTest',
    //   // username: 'root',
    //   // password: 'root',
    //   autoLoadEntities: true,
    //   // entities: [join(__dirname, '**/**.entity.{ts,js}')],
    //   // Setting synchronize: true shouldn't be used in production - otherwise you can lose production data
    //   synchronize: true,
    //   namingStrategy: new PluralNamingStrategy(),
    // }),
  ],
=======
  imports: [SiteModule],
>>>>>>> origin/main
  controllers: [AppController],
  providers: [AppService, DynamoDbService],
})
export class AppModule {}
