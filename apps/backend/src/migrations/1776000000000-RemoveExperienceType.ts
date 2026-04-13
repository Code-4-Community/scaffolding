import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveExperienceType1776000000000 implements MigrationInterface {
  name = 'RemoveExperienceType1776000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" DROP COLUMN "experienceType"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."application_experiencetype_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."application_experiencetype_enum" AS ENUM('BS', 'MS', 'PhD', 'MD', 'MD PhD', 'RN', 'NP', 'PA', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD "experienceType" "public"."application_experiencetype_enum" NOT NULL DEFAULT 'Other'`,
    );
  }
}
