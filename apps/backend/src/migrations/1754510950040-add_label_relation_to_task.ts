import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLabelRelationToTask1754510950040 implements MigrationInterface {
  name = 'AddLabelRelationToTask1754510950040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_category_enum" AS ENUM('Draft', 'To Do', 'In Progress', 'Completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "labels" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "color" character varying NOT NULL, CONSTRAINT "UQ_543605929e5ebe08eeeab493f60" UNIQUE ("name"), CONSTRAINT "PK_c0c4e97f76f1f3a268c7a70b925" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dueDate" TIMESTAMP, "category" "public"."tasks_category_enum" NOT NULL DEFAULT 'Draft', CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks_labels_labels" ("tasksId" integer NOT NULL, "labelsId" integer NOT NULL, CONSTRAINT "PK_f85aea2ec53934cf2a19c64d5ac" PRIMARY KEY ("tasksId", "labelsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f20c9d0af5f9650c92f0b95001" ON "tasks_labels_labels" ("tasksId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9eb372639eba51a1539303cca9" ON "tasks_labels_labels" ("labelsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_labels_labels" ADD CONSTRAINT "FK_f20c9d0af5f9650c92f0b95001c" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_labels_labels" ADD CONSTRAINT "FK_9eb372639eba51a1539303cca97" FOREIGN KEY ("labelsId") REFERENCES "labels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks_labels_labels" DROP CONSTRAINT "FK_9eb372639eba51a1539303cca97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_labels_labels" DROP CONSTRAINT "FK_f20c9d0af5f9650c92f0b95001c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9eb372639eba51a1539303cca9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f20c9d0af5f9650c92f0b95001"`,
    );
    await queryRunner.query(`DROP TABLE "tasks_labels_labels"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "labels"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_category_enum"`);
  }
}
