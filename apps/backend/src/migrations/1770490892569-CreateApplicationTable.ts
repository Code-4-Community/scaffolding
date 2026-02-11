import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApplicationTable1770490892569 implements MigrationInterface {
  name = 'CreateApplicationTable1770490892569';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."application_discipline_enum" AS ENUM('Volunteers', 'Nursing', 'Public Health', 'MD', 'PA', 'NP', 'Research', 'Social Work', 'Psychiatry', 'Pharmacy', 'IT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_appstatus_enum" AS ENUM('App submitted', 'In review', 'Forms sent', 'Accepted', 'Rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_experiencetype_enum" AS ENUM('BS', 'MS', 'PhD', 'MD', 'MD PhD', 'RN', 'NP', 'PA', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_applicanttype_enum" AS ENUM('Learner', 'Volunteer')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_interestarea_enum" AS ENUM('Nursing', 'HarmReduction', 'WomensHealth')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_school_enum" AS ENUM('Harvard Medical School', 'Johns Hopkins', 'Stanford Medicine', 'Mayo Clinic', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "application" ("appId" SERIAL NOT NULL, "email" character varying NOT NULL, "discipline" "public"."application_discipline_enum" NOT NULL, "appStatus" "public"."application_appstatus_enum" NOT NULL DEFAULT 'App submitted', "daysAvailable" character varying NOT NULL, "experienceType" "public"."application_experiencetype_enum" NOT NULL, "fileUploads" text array NOT NULL DEFAULT '{}', "interest" "public"."application_interestarea_enum" NOT NULL, "license" character varying NOT NULL, "phone" character varying NOT NULL, "applicantType" "public"."application_applicanttype_enum" NOT NULL, "school" "public"."application_school_enum" NOT NULL, "referred" boolean DEFAULT false, "referredEmail" character varying, "weeklyHours" integer NOT NULL, CONSTRAINT "PK_bad7d3374806099608903c43d2c" PRIMARY KEY ("appId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "application"`);
    await queryRunner.query(`DROP TYPE "public"."application_school_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."application_interestarea_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."application_applicanttype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."application_experiencetype_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."application_appstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."application_discipline_enum"`);
  }
}
