import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/author.module';
import { InventoryModule } from './inventory/inventory.module';
import { InventoryHoldingModule } from './inventory-holding/inventory-holding.module';
import AppDataSource from './data-source';
import { ProductionInfoModule } from './production-info/production-info.module';
import { StoryModule } from './story/story.module';
import { OmchaiModule } from './omchai/omchai.module';
import { UsersModule } from './users/users.module';
import { StoryDraftModule } from './story-draft/story-draft.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthorModule,
    InventoryModule,
    InventoryHoldingModule,
    ProductionInfoModule,
    StoryModule,
    OmchaiModule,
    UsersModule,
    StoryDraftModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
