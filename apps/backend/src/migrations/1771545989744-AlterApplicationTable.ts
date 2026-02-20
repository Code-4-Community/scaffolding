import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterApplicationTable1771545989744 implements MigrationInterface {
  name = 'AlterApplicationTable1771545989744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "interest" SET DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "interest" DROP DEFAULT`,
    );
  }
}
