import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApplicationInterestToArray1770490892572
  implements MigrationInterface
{
  name = 'ApplicationInterestToArray1770490892572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "interest" TYPE "public"."interest_area_enum"[] USING array["interest"]`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "interest" SET DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "interest" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "interest" TYPE "public"."interest_area_enum" USING "interest"[1]`,
    );
  }
}
