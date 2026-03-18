import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1773257664892 implements MigrationInterface {
  name = 'InitSchema1773257664892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "authors" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "classPeriod" character varying NOT NULL, "nameInBook" character varying, "bio" character varying, "grade" integer, CONSTRAINT "PK_d2ed02fabd9b52847ccb85e6b88" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "storys" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "studentBio" character varying NOT NULL, "theme" character varying NOT NULL, "anthologyId" integer NOT NULL, "authorId" integer NOT NULL, "anthology" integer, "author" integer, CONSTRAINT "PK_21555e2c0515cc1d4b6a8c642c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventorys" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_38274e9eb3fd9f9d3c846abc834" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventoryholdings" ("id" SERIAL NOT NULL, "inventoryId" integer NOT NULL, "anthologyId" integer NOT NULL, "numCopies" integer NOT NULL, "inventory" integer, "anthology" integer, CONSTRAINT "PK_b3a5d299208da24fbab0badeb96" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "productioninfos" ("id" SERIAL NOT NULL, "design_files_link" character varying, "cover_image_file_link" character varying, "binding_type" character varying, "dimensions" character varying, "printing_cost" double precision, "print_run" integer, "weight_in_grams" double precision, "page_count" integer, "printed_by" character varying, CONSTRAINT "PK_db86a9023b10f56d9120b67b637" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "users_status_enum" AS ENUM('ADMIN', 'VOLUNTEER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer NOT NULL, "status" "users_status_enum" NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL DEFAULT '', "email" character varying NOT NULL DEFAULT '', "publishingName" character varying, "name" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "omchais_role_enum" AS ENUM('OWNER', 'MANAGER', 'CONSULTED', 'HELPER', 'APPROVER', 'INFORMED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "omchais" ("id" SERIAL NOT NULL, "anthologyId" integer NOT NULL, "userId" integer NOT NULL, "role" "omchais_role_enum" NOT NULL, "datetimeAssigned" date NOT NULL, "user" integer, "anthology" integer, CONSTRAINT "PK_84d53f60fa19cddfc4ed371c9bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "anthologys_status_enum" AS ENUM('Archived', 'NotStarted', 'Drafting', 'CanBeShared')`,
    );
    await queryRunner.query(
      `CREATE TYPE "anthologys_agecategory_enum" AS ENUM('Young Adult Books (Ages 13-18)')`,
    );
    await queryRunner.query(
      `CREATE TYPE "anthologys_publevel_enum" AS ENUM('Zine', 'Chapbook', 'PerfectBound', 'Signature')`,
    );
    await queryRunner.query(
      `CREATE TABLE "anthologys" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "byline" character varying NOT NULL DEFAULT '', "subtitle" character varying, "description" character varying NOT NULL, "genres" text NOT NULL DEFAULT '[]', "themes" text NOT NULL DEFAULT '[]', "triggers" text NOT NULL DEFAULT '[]', "publishedDate" date NOT NULL, "programs" text, "sponsors" text, "status" "anthologys_status_enum" NOT NULL, "ageCategory" "anthologys_agecategory_enum", "pubLevel" "anthologys_publevel_enum" NOT NULL, "photoUrl" character varying DEFAULT '', "isbn" character varying, "shopifyUrl" character varying DEFAULT '', CONSTRAINT "PK_bb0c9f592636d271b46e6af1ee8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "storydrafts_submissionround_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TYPE "storydrafts_editround_enum" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `CREATE TABLE "storydrafts" ("id" SERIAL NOT NULL, "authorId" integer NOT NULL, "docLink" character varying NOT NULL, "submissionRound" "storydrafts_submissionround_enum" NOT NULL, "studentConsent" boolean NOT NULL, "inManuscript" boolean NOT NULL, "editRound" "storydrafts_editround_enum" NOT NULL, "proofread" boolean NOT NULL, "notes" text array NOT NULL, CONSTRAINT "PK_39aaf376a55cf146f7e817faccc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ADD CONSTRAINT "FK_6dc59aeaa8e7cf1a8b1b784a242" FOREIGN KEY ("anthology") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" ADD CONSTRAINT "FK_c06adbefb259657db63866bf0df" FOREIGN KEY ("author") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" ADD CONSTRAINT "FK_7d6a8f8e8e13b8af8ca095a3ed8" FOREIGN KEY ("inventory") REFERENCES "inventorys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" ADD CONSTRAINT "FK_118331a8880fcea1c951e4955fd" FOREIGN KEY ("anthology") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "omchais" ADD CONSTRAINT "FK_6d37f0d754706d78ea1a5427c22" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "omchais" ADD CONSTRAINT "FK_6069876e8c78c2516e7ea88f617" FOREIGN KEY ("anthology") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "omchais" DROP CONSTRAINT "FK_6069876e8c78c2516e7ea88f617"`,
    );
    await queryRunner.query(
      `ALTER TABLE "omchais" DROP CONSTRAINT "FK_6d37f0d754706d78ea1a5427c22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" DROP CONSTRAINT "FK_118331a8880fcea1c951e4955fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventoryholdings" DROP CONSTRAINT "FK_7d6a8f8e8e13b8af8ca095a3ed8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" DROP CONSTRAINT "FK_c06adbefb259657db63866bf0df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storys" DROP CONSTRAINT "FK_6dc59aeaa8e7cf1a8b1b784a242"`,
    );
    await queryRunner.query(`DROP TABLE "storydrafts"`);
    await queryRunner.query(`DROP TYPE "storydrafts_editround_enum"`);
    await queryRunner.query(`DROP TYPE "storydrafts_submissionround_enum"`);
    await queryRunner.query(`DROP TABLE "anthologys"`);
    await queryRunner.query(`DROP TYPE "anthologys_publevel_enum"`);
    await queryRunner.query(`DROP TYPE "anthologys_agecategory_enum"`);
    await queryRunner.query(`DROP TYPE "anthologys_status_enum"`);
    await queryRunner.query(`DROP TABLE "omchais"`);
    await queryRunner.query(`DROP TYPE "omchais_role_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "users_status_enum"`);
    await queryRunner.query(`DROP TABLE "productioninfos"`);
    await queryRunner.query(`DROP TABLE "inventoryholdings"`);
    await queryRunner.query(`DROP TABLE "inventorys"`);
    await queryRunner.query(`DROP TABLE "storys"`);
    await queryRunner.query(`DROP TABLE "authors"`);
  }
}
