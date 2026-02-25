import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSundayAvailability1772059627598 implements MigrationInterface {
  name = 'AddSundayAvailability1772059627598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" ADD "sundayAvailability" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" DROP COLUMN "sundayAvailability"`,
    );
  }
}
