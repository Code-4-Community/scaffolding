import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApplicationTable1770300403706 implements MigrationInterface {
  name = 'CreateApplicationTable1770300403706';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "application" (
             "appId" SERIAL NOT NULL,
             "email" character varying NOT NULL,
             "discipline" "public"."application_discipline_enum" NOT NULL,
             "otherDisciplineDescription" character varying,
             "appStatus" "public"."application_appstatus_enum" NOT NULL DEFAULT 'App submitted',
             "mondayAvailability" character varying NOT NULL,
             "tuesdayAvailability" character varying NOT NULL,
             "wednesdayAvailability" character varying NOT NULL,
             "thursdayAvailability" character varying NOT NULL,
             "fridayAvailability" character varying NOT NULL,
             "saturdayAvailability" character varying NOT NULL,
             "experienceType" "public"."application_experiencetype_enum" NOT NULL,
             "interest" "public"."application_interest_enum"[] NOT NULL,
             "license" character varying NOT NULL,
             "phone" character varying NOT NULL,
             "applicantType" "public"."application_applicanttype_enum" NOT NULL,
             "referred" boolean DEFAULT false,
             "referredEmail" character varying,
             "weeklyHours" integer NOT NULL,
             "pronouns" character varying NOT NULL,
             "nonEnglishLangs" character varying,
             "desiredExperience" character varying NOT NULL,
             "elaborateOtherDiscipline" character varying, 
             "resume" character varying NOT NULL, 
             "coverLetter" character varying NOT NULL, 
             "emergencyContactName" character varying NOT NULL, 
             "emergencyContactPhone" character varying NOT NULL, 
             "emergencyContactRelationship" character varying NOT NULL, 
             CONSTRAINT "PK_application_appId" PRIMARY KEY ("appId"));`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "application"`);
  }
}
