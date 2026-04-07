import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveVolunteerInfo1775519032454 implements MigrationInterface {
  name = 'RemoveVolunteerInfo1775519032454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "volunteer_info"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "volunteer_info" (
            "appId" integer NOT NULL,
            "license" character varying NOT NULL,
            CONSTRAINT "PK_volunteer_info_appId" PRIMARY KEY ("appId"),
            CONSTRAINT "FK_volunteer_info_appId" FOREIGN KEY ("appId") REFERENCES "application"("appId") ON DELETE CASCADE
        )`,
    );
  }
}
