import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1770079658463 implements MigrationInterface {
  name = 'InitialSchema1770079658463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "productioninfos" ("id" SERIAL NOT NULL, "anthologyId" integer NOT NULL, "design_files_link" character varying, "cover_image_file_link" character varying, "binding_type" character varying, "dimensions" character varying, "printing_cost" double precision, "print_run" integer, "weight_in_grams" double precision, "page_count" integer, "printed_by" character varying, CONSTRAINT "UQ_07df777350642cb77790bcfbd73" UNIQUE ("anthologyId"), CONSTRAINT "PK_db86a9023b10f56d9120b67b637" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "productioninfos"`);
  }
}
