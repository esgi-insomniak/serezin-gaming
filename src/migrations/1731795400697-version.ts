import { MigrationInterface, QueryRunner } from 'typeorm';

export class Version1731795400697 implements MigrationInterface {
  name = 'Version1731795400697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "match" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start" TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isRed" boolean NOT NULL, "matchId" uuid, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid, "memberId" uuid, CONSTRAINT "UQ_034f1d4433cf56b017f22e05670" UNIQUE ("teamId", "memberId"), CONSTRAINT "PK_649680684d72a20d279641469c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tier" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" integer NOT NULL, CONSTRAINT "UQ_74fab256d5bee12394b6e04471c" UNIQUE ("value"), CONSTRAINT "PK_14d67ceef0dbea040e39e97e7f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tournament" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_449f912ba2b62be003f0c22e767" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid, "tierId" uuid, "ownTournamentId" uuid, "tournamentId" uuid, CONSTRAINT "REL_d48f9e84e54637ca1653a30839" UNIQUE ("ownTournamentId"), CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tournament_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, CONSTRAINT "UQ_f59b804e7f0c6fa4da3ef37db03" UNIQUE ("slug"), CONSTRAINT "PK_ee4243333465157f480877f865c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_12b7ae15b9104ba083bdc725e5b" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "FK_74da8f612921485e1005dc8e225" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_member" ADD CONSTRAINT "FK_5d9ce201b6f8ef83235de34646d" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_ce159f87a1a69d5c4bb9dbb2b55" FOREIGN KEY ("roleId") REFERENCES "tournament_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_2e74d7f633648e080532c32f5ed" FOREIGN KEY ("tierId") REFERENCES "tier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_d48f9e84e54637ca1653a30839a" FOREIGN KEY ("ownTournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_8b59cf75628dc0e4cfc6ab723dc" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_8b59cf75628dc0e4cfc6ab723dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_d48f9e84e54637ca1653a30839a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_2e74d7f633648e080532c32f5ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_ce159f87a1a69d5c4bb9dbb2b55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "FK_5d9ce201b6f8ef83235de34646d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_member" DROP CONSTRAINT "FK_74da8f612921485e1005dc8e225"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_12b7ae15b9104ba083bdc725e5b"`,
    );
    await queryRunner.query(`DROP TABLE "tournament_role"`);
    await queryRunner.query(`DROP TABLE "member"`);
    await queryRunner.query(`DROP TABLE "tournament"`);
    await queryRunner.query(`DROP TABLE "tier"`);
    await queryRunner.query(`DROP TABLE "team_member"`);
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP TABLE "match"`);
  }
}
