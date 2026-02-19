import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1769375899623 implements MigrationInterface {
  name = 'InitSchema1769375899623';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "authors" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "bio" character varying, "grade" integer, CONSTRAINT "PK_d2ed02fabd9b52847ccb85e6b88" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "storys" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "studentBio" character varying NOT NULL, "genre" character varying NOT NULL, "theme" character varying NOT NULL, "anthology" integer, "author" integer, CONSTRAINT "PK_21555e2c0515cc1d4b6a8c642c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventorys" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_38274e9eb3fd9f9d3c846abc834" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventoryholdings" ("id" SERIAL NOT NULL, "num_copies" integer NOT NULL, "anthology" integer, "inventory" integer, CONSTRAINT "PK_b3a5d299208da24fbab0badeb96" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "anthologys" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "published_year" integer NOT NULL, "programs" text, "status" character varying NOT NULL, "pub_level" character varying NOT NULL, "photo_url" character varying, "isbn" character varying, "shopify_url" character varying, CONSTRAINT "PK_bb0c9f592636d271b46e6af1ee8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ADD CONSTRAINT "FK_6dc59aeaa8e7cf1a8b1b784a242" FOREIGN KEY ("anthology") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ADD CONSTRAINT "FK_c06adbefb259657db63866bf0df" FOREIGN KEY ("author") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" ADD CONSTRAINT "FK_118331a8880fcea1c951e4955fd" FOREIGN KEY ("anthology") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" ADD CONSTRAINT "FK_7d6a8f8e8e13b8af8ca095a3ed8" FOREIGN KEY ("inventory") REFERENCES "inventorys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" DROP CONSTRAINT "FK_7d6a8f8e8e13b8af8ca095a3ed8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" DROP CONSTRAINT "FK_118331a8880fcea1c951e4955fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" DROP CONSTRAINT "FK_c06adbefb259657db63866bf0df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" DROP CONSTRAINT "FK_6dc59aeaa8e7cf1a8b1b784a242"`,
    );
    await queryRunner.query(`DROP TABLE "anthologys"`);
    await queryRunner.query(`DROP TABLE "inventoryholdings"`);
    await queryRunner.query(`DROP TABLE "inventorys"`);
    await queryRunner.query(`DROP TABLE "storys"`);
    await queryRunner.query(`DROP TABLE "authors"`);
  }
}
