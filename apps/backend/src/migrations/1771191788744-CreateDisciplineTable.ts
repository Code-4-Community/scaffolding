import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDisciplineTable1771191788744 implements MigrationInterface {
  name = 'CreateDisciplineTable1771191788744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."admins_discipline_enum" AS ENUM('MD/Medical Student/Pre-Med', 'Medical NP/PA', 'Psychiatry or Psychiatric NP/PA', 'Public Health', 'RN', 'Social Work', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "discipline" "public"."admins_discipline_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_discipline_enum" AS ENUM('MD/Medical Student/Pre-Med', 'Medical NP/PA', 'Psychiatry or Psychiatric NP/PA', 'Public Health', 'RN', 'Social Work', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_appstatus_enum" AS ENUM('App submitted', 'In review', 'Forms sent', 'Accepted', 'No Availability', 'Declined', 'Active', 'Inactive')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_experiencetype_enum" AS ENUM('BS', 'MS', 'PhD', 'MD', 'MD PhD', 'RN', 'NP', 'PA', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_interest_enum" AS ENUM('Women''s Health', 'Medical Respite/Inpatient', 'Street Medicine', 'Addiction Medicine', 'Primary Care', 'Behavioral Health', 'Veterans Services', 'Family and Youth Services', 'Hep C Care', 'HIV Services', 'Case Management', 'Dental')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_applicanttype_enum" AS ENUM('Learner', 'Volunteer')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_school_enum" AS ENUM('Harvard Medical School', 'Johns Hopkins', 'Stanford Medicine', 'Mayo Clinic', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "application" ("appId" SERIAL NOT NULL, "email" character varying NOT NULL, "discipline" "public"."application_discipline_enum" NOT NULL, "otherDisciplineDescription" character varying, "appStatus" "public"."application_appstatus_enum" NOT NULL DEFAULT 'App submitted', "mondayAvailability" character varying NOT NULL, "tuesdayAvailability" character varying NOT NULL, "wednesdayAvailability" character varying NOT NULL, "thursdayAvailability" character varying NOT NULL, "fridayAvailability" character varying NOT NULL, "saturdayAvailability" character varying NOT NULL, "experienceType" "public"."application_experiencetype_enum" NOT NULL, "interest" "public"."application_interest_enum" NOT NULL, "license" character varying NOT NULL, "phone" character varying NOT NULL, "applicantType" "public"."application_applicanttype_enum" NOT NULL, "school" "public"."application_school_enum" NOT NULL, "otherSchool" character varying, "referred" boolean DEFAULT false, "referredEmail" character varying, "weeklyHours" integer NOT NULL, "pronouns" character varying NOT NULL, "nonEnglishLangs" character varying, "desiredExperience" character varying NOT NULL, "elaborateOtherDiscipline" character varying, "resume" character varying NOT NULL, "coverLetter" character varying NOT NULL, "emergencyContactName" character varying NOT NULL, "emergencyContactPhone" character varying NOT NULL, "emergencyContactRelationship" character varying NOT NULL, CONSTRAINT "PK_bad7d3374806099608903c43d2c" PRIMARY KEY ("appId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."discipline_name_enum" AS ENUM('MD/Medical Student/Pre-Med', 'Medical NP/PA', 'Psychiatry or Psychiatric NP/PA', 'Public Health', 'RN', 'Social Work', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "discipline" ("id" SERIAL NOT NULL, "name" "public"."discipline_name_enum" NOT NULL, "admin_ids" integer array NOT NULL DEFAULT '{}', CONSTRAINT "PK_139512aefbb11a5b2fa92696828" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."learner_info_school_enum" AS ENUM('Harvard Medical School', 'Johns Hopkins', 'Stanford Medicine', 'Mayo Clinic', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "learner_info" ("appId" integer NOT NULL, "school" "public"."learner_info_school_enum" NOT NULL, "schoolDepartment" character varying, "isSupervisorApplying" boolean NOT NULL, "isLegalAdult" boolean NOT NULL, "dateOfBirth" date, "courseRequirements" character varying, "instructorInfo" character varying, "syllabus" character varying, CONSTRAINT "PK_235c32ff8a2161278e21f4b5ff9" PRIMARY KEY ("appId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "volunteer_info" ("appId" integer NOT NULL, "license" character varying NOT NULL, CONSTRAINT "PK_4df167dc51855ca6dfae345e0fc" PRIMARY KEY ("appId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "volunteer_info"`);
    await queryRunner.query(`DROP TABLE "learner_info"`);
    await queryRunner.query(`DROP TYPE "public"."learner_info_school_enum"`);
    await queryRunner.query(`DROP TABLE "discipline"`);
    await queryRunner.query(`DROP TYPE "public"."discipline_name_enum"`);
    await queryRunner.query(`DROP TABLE "application"`);
    await queryRunner.query(`DROP TYPE "public"."application_school_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."application_applicanttype_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."application_interest_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."application_experiencetype_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."application_appstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."application_discipline_enum"`);
    await queryRunner.query(`DROP TABLE "admins"`);
    await queryRunner.query(`DROP TYPE "public"."admins_discipline_enum"`);
  }
}
