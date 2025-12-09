import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'test',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
//  Configuration Added
// Data Source (data-source.ts)

// Database connection configuration
// Migrations and entities paths set up
// Migration Scripts (in package.json)

// pnpm run migration:generate - Auto-generate from entity changes
// pnpm run migration:create - Create empty migration
// pnpm run migration:run - Execute migrations
// pnpm run migration:revert - Rollback last migration
// Environment Variables (.env)

// Added database configuration (DB_HOST, DB_PORT, etc.)
// App Module Updated

// Changed synchronize: false (proper for production)
// Database config now reads from environment variables
