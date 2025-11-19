import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameEmailDisciplineToApplication1763586010682
  implements MigrationInterface
{
  name = 'AddNameEmailDisciplineToApplication1763586010682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD "disciplineId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD "fileUploads" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(`ALTER TABLE "discipline" DROP COLUMN "name"`);
    await queryRunner.query(
      `CREATE TYPE "public"."discipline_name_enum" AS ENUM('Volunteers', 'Nursing', 'Public Health', 'MD', 'PA', 'NP', 'Research', 'Social Work', 'Psychiatry', 'Pharmacy', 'IT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "discipline" ADD "name" "public"."discipline_name_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."app_status_enum" RENAME TO "app_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_appstatus_enum" AS ENUM('App submitted', 'In review', 'Forms sent', 'Accepted', 'Rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" TYPE "public"."application_appstatus_enum" USING "appStatus"::"text"::"public"."application_appstatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" SET DEFAULT 'App submitted'`,
    );
    await queryRunner.query(`DROP TYPE "public"."app_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."experience_type_enum" RENAME TO "experience_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_experiencetype_enum" AS ENUM('BS', 'MS', 'PhD', 'MD', 'MD PhD', 'RN', 'NP', 'PA', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "experienceType" TYPE "public"."application_experiencetype_enum" USING "experienceType"::"text"::"public"."application_experiencetype_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."experience_type_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."interest_area_enum" RENAME TO "interest_area_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_interest_enum" AS ENUM('Nursing', 'HarmReduction', 'WomensHealth')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "interest" TYPE "public"."application_interest_enum" USING "interest"::"text"::"public"."application_interest_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."interest_area_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "license" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."school_enum" RENAME TO "school_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_school_enum" AS ENUM('Harvard Medical School', 'Johns Hopkins', 'Stanford Medicine', 'Mayo Clinic', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "school" TYPE "public"."application_school_enum" USING "school"::"text"::"public"."application_school_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."school_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "referred" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD CONSTRAINT "FK_6a25198b8a8ccc5c0e2b2b758ee" FOREIGN KEY ("disciplineId") REFERENCES "discipline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" DROP CONSTRAINT "FK_6a25198b8a8ccc5c0e2b2b758ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "referred" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."school_enum_old" AS ENUM('Harvard Medical School', 'Johns Hopkins', 'Stanford Medicine', 'Mayo Clinic', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "school" TYPE "public"."school_enum_old" USING "school"::"text"::"public"."school_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."application_school_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."school_enum_old" RENAME TO "school_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "license" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."interest_area_enum_old" AS ENUM('Nursing', 'HarmReduction', 'WomensHealth')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "interest" TYPE "public"."interest_area_enum_old" USING "interest"::"text"::"public"."interest_area_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."application_interest_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."interest_area_enum_old" RENAME TO "interest_area_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."experience_type_enum_old" AS ENUM('BS', 'MS', 'PhD', 'MD', 'MD PhD', 'RN', 'NP', 'PA', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "experienceType" TYPE "public"."experience_type_enum_old" USING "experienceType"::"text"::"public"."experience_type_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."application_experiencetype_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."experience_type_enum_old" RENAME TO "experience_type_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."app_status_enum_old" AS ENUM('App submitted', 'in review', 'forms sent', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" TYPE "public"."app_status_enum_old" USING "appStatus"::"text"::"public"."app_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "appStatus" SET DEFAULT 'App submitted'`,
    );
    await queryRunner.query(`DROP TYPE "public"."application_appstatus_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."app_status_enum_old" RENAME TO "app_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "discipline" DROP COLUMN "name"`);
    await queryRunner.query(`DROP TYPE "public"."discipline_name_enum"`);
    await queryRunner.query(
      `ALTER TABLE "discipline" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" DROP COLUMN "fileUploads"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" DROP COLUMN "disciplineId"`,
    );
    await queryRunner.query(`ALTER TABLE "application" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "application" DROP COLUMN "name"`);
  }
}
