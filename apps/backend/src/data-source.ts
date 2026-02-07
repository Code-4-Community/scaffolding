import { DataSource } from 'typeorm';
import { PluralNamingStrategy } from './strategies/plural-naming.strategy';
import * as dotenv from 'dotenv';
import { Anthology } from './anthology/anthology.entity';
import { Author } from './author/author.entity';
import { Inventory } from './inventory/inventory.entity';
import { InventoryHolding } from './inventory-holding/inventory-holding.entity';
import { Story } from './story/story.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.NX_DB_HOST,
  port: parseInt(process.env.NX_DB_PORT as string, 10),
  username: process.env.NX_DB_USERNAME,
  password: process.env.NX_DB_PASSWORD,
  database: process.env.NX_DB_DATABASE,
  entities: [Anthology, Author, Inventory, InventoryHolding, Story],
  migrations: ['apps/backend/src/migrations/*.js'],
  // Setting synchronize: true shouldn't be used in production - otherwise you can lose production data
  synchronize: false,
  namingStrategy: new PluralNamingStrategy(),
});

export default AppDataSource;
