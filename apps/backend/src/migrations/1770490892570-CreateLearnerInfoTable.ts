import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLearnerInfoTable1770490892570 implements MigrationInterface {
  name = 'CreateLearnerInfoTable1770490892570';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "learner_info" (
        "appId" integer NOT NULL,
        "school" "public"."learner_info_school_enum" NOT NULL,
        CONSTRAINT "PK_learner_info_appId" PRIMARY KEY ("appId"),
        CONSTRAINT "FK_learner_info_appId" FOREIGN KEY ("appId") REFERENCES "application"("appId") ON DELETE CASCADE
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "learner_info"`);
  }
}
