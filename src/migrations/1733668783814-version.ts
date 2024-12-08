import { MigrationInterface, QueryRunner } from 'typeorm';

export class Version1733668783814 implements MigrationInterface {
  name = 'Version1733668783814';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "name" character varying(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "name"`);
  }
}
