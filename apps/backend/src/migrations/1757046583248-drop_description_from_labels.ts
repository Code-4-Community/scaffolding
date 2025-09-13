import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropDescriptionFromLabels1757046583248
  implements MigrationInterface
{
  name = 'DropDescriptionFromLabels1757046583248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "labels" DROP COLUMN "description"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "labels" ADD "description" varchar`);
  }
}
