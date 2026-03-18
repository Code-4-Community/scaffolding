import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterApplicationTable1771635679051 implements MigrationInterface {
  name = 'AlterApplicationTable1771635679051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."application_heardaboutfrom_enum" AS ENUM('Online Search', 'BHCHP Website', 'School', 'From a BHCHP Staff Member', 'Other', 'Friend/Family', 'I am a current/former BHCHP staff member')`,
    );
    await queryRunner.query(`ALTER TABLE "applicants" DROP COLUMN "startDate"`);
    await queryRunner.query(
      `ALTER TABLE "applicants" ADD "proposedStartDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicants" ADD "actualStartDate" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD "heardAboutFrom" "public"."application_heardaboutfrom_enum" array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TYPE "public"."application_heardaboutfrom_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicants" DROP COLUMN "actualStartDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicants" DROP COLUMN "proposedStartDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicants" ADD "startDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicants" ADD CONSTRAINT "FK_applicants_appId" FOREIGN KEY ("appId") REFERENCES "application"("appId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" DROP COLUMN "heardAboutFrom"`,
    );
  }
}
