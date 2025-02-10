import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DynamoDbService } from "../dynamodb";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Module({
    providers: [UserService, DynamoDbService],
    controllers: [UserController],
    exports: [UserService],
})

export class UserModule{}