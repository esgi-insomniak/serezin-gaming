import { MigrationInterface, QueryRunner } from 'typeorm';

export class Version1733335587038 implements MigrationInterface {
  name = 'Version1733335587038';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "isArchived" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP COLUMN "isArchived"`,
    );
  }
}
