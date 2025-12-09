import { MigrationInterface, QueryRunner } from "typeorm";

export class NewAddview1765304873597 implements MigrationInterface {
    name = 'NewAddview1765304873597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`news\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`news\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`news\` ADD \`views\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`news\` DROP COLUMN \`views\``);
        await queryRunner.query(`ALTER TABLE \`news\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`news\` ADD \`user_id\` varchar(255) NOT NULL`);
    }

}
