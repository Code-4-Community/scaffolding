import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApplicantTable1770490892573 implements MigrationInterface {
  name = 'CreateApplicantTable1770490892573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "applicants" (
        "app_id" integer NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "startDate" date NOT NULL,
        "endDate" date NOT NULL,
        CONSTRAINT "PK_applicants_app_id" PRIMARY KEY ("app_id"),
        CONSTRAINT "FK_applicants_app_id" FOREIGN KEY ("app_id") REFERENCES "application"("appId") ON DELETE CASCADE
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "applicants"`);
  }
}
