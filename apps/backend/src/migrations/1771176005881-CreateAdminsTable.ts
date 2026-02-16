import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAdminsTable1771176005881 implements MigrationInterface {
  name = 'CreateAdminsTable1771176005881';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the discipline enum type
    await queryRunner.query(`
        CREATE TYPE "admins_discipline_enum" AS ENUM (
          'MD/Medical Student/Pre-Med',
          'Medical NP/PA',
          'Psychiatry or Psychiatric NP/PA',
          'Public Health',
          'RN',
          'Social Work',
          'Other'
        )
      `);

    await queryRunner.createTable(
      new Table({
        name: 'admins',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'discipline',
            type: 'admins_discipline_enum',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admins');
    await queryRunner.query('DROP TYPE "admins_discipline_enum"');
  }
}
