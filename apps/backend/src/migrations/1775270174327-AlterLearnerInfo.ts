import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterLearnerInfo1775270174327 implements MigrationInterface {
  name = 'AlterLearnerInfo1775270174327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."learner_info_school_enum" RENAME TO "learner_info_school_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."learner_info_school_enum" AS ENUM('BIDMC - Residents', 'BMC Addiction Medicine', 'BMC - Family Medicine', 'BMC SOM - Center for Multicultural Training in Psychology', 'Boston College - Lynch School of Ed and Human Development', 'Boston Graduate School of Psychoanalysis', 'Boston University', 'Boston Medical Center Grayken Center', 'Boston University SOM DGMS physician assistant program', 'BU Mental Health Counseling and Behavioral Medicine Program', 'BWH Addiction Medicine', 'Capella University', 'Fisher College', 'Georgetown University School of Medicine', 'Johns Hopkins', 'Laboure College', 'Medex Northwest PA', 'MGH Addiction Medicine', 'MGH Pediatric Residency Program', 'Michigan State University', 'Northeastern', 'Northeastern Bouve College of Health Sciences', 'Norwich University', 'Salem State', 'State University of New York', 'UMass Boston - NP/PA', 'UMass Boston - Nursing', 'University of Washington School of Medicine', 'Western Governors University', 'Worcester State University', 'Other', 'Does not apply')`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" ALTER COLUMN "school" TYPE "public"."learner_info_school_enum" USING "school"::"text"::"public"."learner_info_school_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."learner_info_school_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."learner_info_school_enum_old" AS ENUM('Harvard Medical School', 'Johns Hopkins', 'Stanford Medicine', 'Mayo Clinic', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" ALTER COLUMN "school" TYPE "public"."learner_info_school_enum_old" USING "school"::"text"::"public"."learner_info_school_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."learner_info_school_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."learner_info_school_enum_old" RENAME TO "learner_info_school_enum"`,
    );
  }
}
