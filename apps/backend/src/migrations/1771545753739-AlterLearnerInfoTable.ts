import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterLearnerInfoTable1771545753739 implements MigrationInterface {
  name = 'AlterLearnerInfoTable1771545753739';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "learner_info" ADD "schoolDepartment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" ADD "isSupervisorApplying" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" ADD "isLegalAdult" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" ADD "dateOfBirth" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" ADD "courseRequirements" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" ADD "instructorInfo" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" ADD "syllabus" character varying`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."application_school_enum" RENAME TO "application_school_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."learner_info_school_enum" AS ENUM('Harvard Medical School', 'Johns Hopkins', 'Stanford Medicine', 'Mayo Clinic', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" ALTER COLUMN "school" TYPE "public"."learner_info_school_enum" USING "school"::"text"::"public"."learner_info_school_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."application_school_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."application_school_enum_old" AS ENUM('Harvard Medical School', 'Johns Hopkins', 'Stanford Medicine', 'Mayo Clinic', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" ALTER COLUMN "school" TYPE "public"."application_school_enum_old" USING "school"::"text"::"public"."application_school_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."learner_info_school_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."application_school_enum_old" RENAME TO "application_school_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" DROP COLUMN "syllabus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" DROP COLUMN "instructorInfo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" DROP COLUMN "courseRequirements"`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" DROP COLUMN "dateOfBirth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" DROP COLUMN "isLegalAdult"`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" DROP COLUMN "isSupervisorApplying"`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" DROP COLUMN "schoolDepartment"`,
    );
  }
}
