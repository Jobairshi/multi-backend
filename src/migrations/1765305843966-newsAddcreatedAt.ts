import { MigrationInterface, QueryRunner } from "typeorm";

export class NewsAddcreatedAt1765305843966 implements MigrationInterface {
    name = 'NewsAddcreatedAt1765305843966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`news\` ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`news\` DROP COLUMN \`createdAt\``);
    }

}
