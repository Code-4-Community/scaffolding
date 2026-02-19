import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApplicantTable1770490892573 implements MigrationInterface {
  name = 'CreateApplicantTable1770490892573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "applicants" (
        "appId" integer NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "startDate" date NOT NULL,
        "endDate" date NOT NULL,
        CONSTRAINT "PK_applicants_appId" PRIMARY KEY ("appId"),
        CONSTRAINT "FK_applicants_appId" FOREIGN KEY ("appId") REFERENCES "application"("appId") ON DELETE CASCADE
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "applicants"`);
  }
}
