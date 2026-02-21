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
      `ALTER TABLE "learner_info" ADD "otherSchool" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(
      `ALTER TABLE "learner_info" DROP COLUMN "otherSchool"`,
    );
  }
}
