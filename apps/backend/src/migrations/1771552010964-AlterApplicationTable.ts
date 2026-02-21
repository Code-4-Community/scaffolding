import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterApplicationTable1771552010964 implements MigrationInterface {
  name = 'AlterApplicationTable1771552010964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."application_heardaboutfrom_enum" AS ENUM('Online Search', 'BHCHP Website', 'School', 'From a BHCHP Staff Member', 'Other', 'Friend/Family', 'I am a current/former BHCHP staff member')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD "heardAboutFrom" "public"."application_heardaboutfrom_enum" array NOT NULL DEFAULT '{}'`,
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
      `ALTER TABLE "application" DROP COLUMN "heardAboutFrom"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."application_heardaboutfrom_enum"`,
    );
  }
}
