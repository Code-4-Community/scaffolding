import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductionInfo1769649528013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "production_info" (
                "id" SERIAL NOT NULL,
                "anthology_id" integer NOT NULL,
                "design_files_link" character varying,
                "cover_image_file_link" character varying,
                "binding_type" character varying,
                "dimensions" character varying,
                "printing_cost" double precision,
                "print_run" integer,
                "weight_in_grams" double precision,
                "page_count" integer,
                "printed_by" character varying,
                CONSTRAINT "REL_anthology_id" UNIQUE ("anthology_id"),
                CONSTRAINT "PK_production_info_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "production_info"
            ADD CONSTRAINT "FK_production_info_anthology"
            FOREIGN KEY ("anthology_id") REFERENCES "anthology"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "production_info" DROP CONSTRAINT "FK_production_info_anthology"`,
    );
    await queryRunner.query(`DROP TABLE "production_info"`);
  }
}
