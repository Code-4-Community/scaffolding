import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInternalNotesToApplications1781306552405
  implements MigrationInterface
{
  name = 'AddInternalNotesToApplications1781306552405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" DROP CONSTRAINT "FK_application_discipline_key"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UQ_discipline_key"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_discipline_label"`);
    await queryRunner.query(
      `ALTER TABLE "application" DROP CONSTRAINT "CHK_application_desiredExperience_allowed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD "internalNotes" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "discipline" ADD CONSTRAINT "UQ_8e7dbc4c94e2523e93a8204c9c9" UNIQUE ("key")`,
    );
    await queryRunner.query(
      `ALTER TABLE "discipline" ADD CONSTRAINT "UQ_c14f089503ae8aad2632abff710" UNIQUE ("label")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discipline" DROP CONSTRAINT "UQ_c14f089503ae8aad2632abff710"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discipline" DROP CONSTRAINT "UQ_8e7dbc4c94e2523e93a8204c9c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" DROP COLUMN "internalNotes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD CONSTRAINT "CHK_application_desiredExperience_allowed" CHECK ((("desiredExperience")::text = ANY ((ARRAY['Pre-Licensure Placement (NP/PA, Nursing, Behavioral Health, Psychiatry)'::character varying, 'Practicum'::character varying, 'Public Health Project'::character varying, 'Shadowing'::character varying, 'Volunteer/Intern'::character varying])::text[])))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_discipline_label" ON "discipline" ("label") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_discipline_key" ON "discipline" ("key") `,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD CONSTRAINT "FK_application_discipline_key" FOREIGN KEY ("discipline") REFERENCES "discipline"("key") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
