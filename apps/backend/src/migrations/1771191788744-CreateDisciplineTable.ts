import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDisciplineTable1771191788744 implements MigrationInterface {
  name = 'CreateDisciplineTable1771191788744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "discipline" ("id" SERIAL NOT NULL, "name" "public"."discipline_name_enum" NOT NULL, "admin_ids" integer array NOT NULL DEFAULT '{}', CONSTRAINT "PK_139512aefbb11a5b2fa92696828" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "discipline"`);
  }
}
