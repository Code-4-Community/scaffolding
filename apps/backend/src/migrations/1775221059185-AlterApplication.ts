import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterApplication1775221059185 implements MigrationInterface {
  name = 'AlterApplication1775221059185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."application_appstatus_enum" RENAME TO "application_appstatus_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_appstatus_enum" AS ENUM('App Submitted', 'In Review', 'Forms Signed', 'Accepted', 'No Availability', 'Declined', 'Active', 'Inactive')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" TYPE "public"."application_appstatus_enum" USING "appStatus"::"text"::"public"."application_appstatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" SET DEFAULT 'App Submitted'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."application_appstatus_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."application_appstatus_enum_old" AS ENUM('App submitted', 'In review', 'Forms sent', 'Accepted', 'No Availability', 'Declined', 'Active', 'Inactive')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" TYPE "public"."application_appstatus_enum_old" USING "appStatus"::"text"::"public"."application_appstatus_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" SET DEFAULT 'App submitted'`,
    );
    await queryRunner.query(`DROP TYPE "public"."application_appstatus_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."application_appstatus_enum_old" RENAME TO "application_appstatus_enum"`,
    );
  }
}
