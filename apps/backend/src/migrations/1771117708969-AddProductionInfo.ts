import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductionInfo1771117708969 implements MigrationInterface {
  name = 'AddProductionInfo1771117708969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "productioninfos" ("id" SERIAL NOT NULL, "anthology_id" integer, "design_files_link" character varying, "cover_image_file_link" character varying, "binding_type" character varying, "dimensions" character varying, "printing_cost" double precision, "print_run" integer, "weight_in_grams" double precision, "page_count" integer, "printed_by" character varying, CONSTRAINT "REL_anthology_id" UNIQUE ("anthology_id"), CONSTRAINT "PK_productioninfos_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "productioninfos" ADD CONSTRAINT "FK_productioninfos_anthology_id" FOREIGN KEY ("anthology_id") REFERENCES "anthologys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productioninfos" DROP CONSTRAINT "FK_productioninfos_anthology_id"`,
    );
    await queryRunner.query(`DROP TABLE "productioninfos"`);
  }
}
