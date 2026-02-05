import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/author.module';
import { InventoryModule } from './inventory/inventory.module';
import { InventoryHoldingModule } from './inventory-holding/inventory-holding.module';
import { StoryModule } from './story/story.module';
import { StoryDraftModule } from './story-draft/story-draft.module';
import AppDataSource from './data-source';
import { ProductionInfoModule } from './production-info/production-info.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthorModule,
    InventoryModule,
    InventoryHoldingModule,
    StoryModule,
    StoryDraftModule,
    ProductionInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
