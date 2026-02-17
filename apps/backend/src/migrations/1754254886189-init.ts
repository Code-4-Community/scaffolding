import { MigrationInterface, QueryRunner } from 'typeorm';
import { Site } from '../users/types';

export class Init1754254886189 implements MigrationInterface {
  name = 'Init1754254886189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."commit_length_enum" AS ENUM('Semester', 'Month', 'Year')`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."site_enum" AS ENUM('Downtown Campus', 'North Campus', 'West Campus', 'East Campus')`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."app_status_enum" AS ENUM('App submitted', 'In review', 'Forms sent', 'Accepted', 'Rejected')`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."school_enum" AS ENUM('Harvard Medical School', 'Johns Hopkins', 'Stanford Medicine', 'Mayo Clinic', 'Other')`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."experience_type_enum" AS ENUM('BS', 'MS', 'PhD', 'MD', 'MD PhD', 'RN', 'NP', 'PA', 'Other')`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."interest_area_enum" AS ENUM('Nursing', 'HarmReduction', 'WomensHealth')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "learner"`);
    await queryRunner.query(`DROP TABLE "application"`);
    await queryRunner.query(`DROP TABLE "discipline"`);
    await queryRunner.query(`DROP TABLE "admins"`);
    await queryRunner.query(`DROP TABLE "admin"`);
    await queryRunner.query(`DROP TYPE "public"."interest_area_enum"`);
    await queryRunner.query(`DROP TYPE "public"."experience_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."school_enum"`);
    await queryRunner.query(`DROP TYPE "public"."app_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."site_enum"`);
    await queryRunner.query(`DROP TYPE "public"."admins_site_enum"`);
    await queryRunner.query(`DROP TYPE "public"."commit_length_enum"`);
  }
}
