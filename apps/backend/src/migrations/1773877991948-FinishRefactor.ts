import { MigrationInterface, QueryRunner } from 'typeorm';

export class FinishRefactor1773877991948 implements MigrationInterface {
  name = ' FinishRefactor1773877991948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "applicants"');
    await queryRunner.query('DROP TABLE "admins"');
    await queryRunner.query(
      `ALTER TABLE "learner_info" DROP CONSTRAINT "FK_learner_info_appId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_info" DROP CONSTRAINT "FK_volunteer_info_appId"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admin_info_discipline_enum" AS ENUM('MD/Medical Student/Pre-Med', 'Medical NP/PA', 'Psychiatry or Psychiatric NP/PA', 'Public Health', 'RN', 'Social Work', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin_info" ("email" character varying NOT NULL, "discipline" "public"."admin_info_discipline_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf3573d155b57bf9c0aad801b80" PRIMARY KEY ("email"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "candidate_info" ("email" character varying NOT NULL, "appId" integer NOT NULL, CONSTRAINT "PK_49789311744921f9d181c9fc068" PRIMARY KEY ("email"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "PK_users_appId"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "appId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    await queryRunner.query(
      `CREATE TYPE "public"."users_usertype_enum" AS ENUM('ADMIN', 'STANDARD')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "userType" "public"."users_usertype_enum" NOT NULL DEFAULT 'STANDARD'`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD "proposedStartDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD "actualStartDate" date`,
    );
    await queryRunner.query(`ALTER TABLE "application" ADD "endDate" date`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_97672ac88f789774dd47f7c8be3" PRIMARY KEY ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "interest" SET DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "interest" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "PK_97672ac88f789774dd47f7c8be3"`,
    );
    await queryRunner.query(`ALTER TABLE "application" DROP COLUMN "endDate"`);
    await queryRunner.query(
      `ALTER TABLE "application" DROP COLUMN "actualStartDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" DROP COLUMN "proposedStartDate"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userType"`);
    await queryRunner.query(`DROP TYPE "public"."users_usertype_enum"`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('ADMIN', 'STANDARD')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "status" "public"."user_status_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "appId" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_users_appId" PRIMARY KEY ("appId")`,
    );
    await queryRunner.query(`DROP TABLE "candidate_info"`);
    await queryRunner.query(`DROP TABLE "admin_info"`);
    await queryRunner.query(`DROP TYPE "public"."admin_info_discipline_enum"`);
    await queryRunner.query(
      `ALTER TABLE "volunteer_info" ADD CONSTRAINT "FK_volunteer_info_appId" FOREIGN KEY ("appId") REFERENCES "application"("appId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "learner_info" ADD CONSTRAINT "FK_learner_info_appId" FOREIGN KEY ("appId") REFERENCES "application"("appId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "applicants" (
            "appId" integer NOT NULL,
            "firstName" character varying NOT NULL,
            "lastName" character varying NOT NULL,
            "startDate" date NOT NULL,
            "endDate" date NOT NULL,
            CONSTRAINT "PK_applicants_appId" PRIMARY KEY ("appId"),
            CONSTRAINT "FK_applicants_appId" FOREIGN KEY ("appId") REFERENCES "application"("appId") ON DELETE CASCADE
        )`,
    );
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "discipline" "public"."admins_discipline_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`,
    );
  }
}
