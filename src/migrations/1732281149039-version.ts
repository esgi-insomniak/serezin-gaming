import { MigrationInterface, QueryRunner } from 'typeorm';

export class Version1732281149039 implements MigrationInterface {
  name = 'Version1732281149039';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_ce159f87a1a69d5c4bb9dbb2b55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" RENAME COLUMN "roleId" TO "role"`,
    );
    await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "role"`);
    await queryRunner.query(
      `CREATE TYPE "public"."member_role_enum" AS ENUM('owner', 'admin', 'member')`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD "role" "public"."member_role_enum" NOT NULL DEFAULT 'member'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."member_role_enum"`);
    await queryRunner.query(`ALTER TABLE "member" ADD "role" uuid`);
    await queryRunner.query(
      `ALTER TABLE "member" RENAME COLUMN "role" TO "roleId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_ce159f87a1a69d5c4bb9dbb2b55" FOREIGN KEY ("roleId") REFERENCES "tournament_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
