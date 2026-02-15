import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOmchaiAndUser1770871050535 implements MigrationInterface {
  name = 'AddOmchaiAndUser1770871050535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."omchais_role_enum" AS ENUM('OWNER', 'MANAGER', 'CONSULTED', 'HELPER', 'APPROVER', 'INFORMED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "omchais" ("id" SERIAL NOT NULL, "anthology_id" integer NOT NULL, "user_id" integer NOT NULL, "role" "public"."omchais_role_enum" NOT NULL, "datetime_assigned" date NOT NULL, CONSTRAINT "PK_84d53f60fa19cddfc4ed371c9bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer NOT NULL, "status" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "publishingName" character varying, "name" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "omchais"`);
    await queryRunner.query(`DROP TYPE "public"."omchais_role_enum"`);
  }
}
