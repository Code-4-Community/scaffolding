import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1771176422893 implements MigrationInterface {
  name = 'CreateUserTable1771176422893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DO $$ BEGIN CREATE TYPE "user_status_enum" AS ENUM ('ADMIN', 'STANDARD'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "users" (
          "appId" integer NOT NULL,
          "status" "user_status_enum" NOT NULL,
          "firstName" character varying NOT NULL,
          "lastName" character varying NOT NULL,
          "email" character varying NOT NULL,
          CONSTRAINT "PK_users_appId" PRIMARY KEY ("appId")
        )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "user_status_enum"`);
  }
}
