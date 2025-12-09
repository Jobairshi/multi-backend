# TypeORM Migration Guide

## ✅ Migration Setup Complete!

### 📦 What Was Configured

1. **Data Source Configuration** (`src/data-source.ts`)
   - Database connection settings
   - Entity and migration paths
   - Used for running migrations

2. **Package.json Scripts**
   - `migration:generate` - Auto-generate migrations from entity changes
   - `migration:create` - Create empty migration file
   - `migration:run` - Run pending migrations
   - `migration:revert` - Revert last migration

3. **Environment Variables** (`.env`)
   - Database configuration added
   - TypeORM will read these for migrations

4. **App Module**
   - Changed `synchronize: false` (use migrations instead)
   - Added environment-based database configuration

---

## 🚀 Migration Commands

### Generate Migration (Automatic)
When you modify an entity, TypeORM can auto-generate the migration:
```bash
pnpm run migration:generate src/migrations/MigrationName
```

### Create Empty Migration (Manual)
Create a blank migration file to write custom SQL:
```bash
pnpm run migration:create src/migrations/MigrationName
```

### Run Migrations
Execute all pending migrations:
```bash
pnpm run migration:run
```

### Revert Last Migration
Undo the most recent migration:
```bash
pnpm run migration:revert
```

---

## 📝 Migration Workflow

### 1. Modify Entity
Edit your entity file (e.g., `user.entity.ts`):
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  // Add new field
  @Column({ nullable: true })
  phoneNumber: string;
}
```

### 2. Generate Migration
```bash
pnpm run migration:generate src/migrations/AddPhoneNumberToUser
```

### 3. Review Migration
Check the generated file in `src/migrations/`:
```typescript
export class AddPhoneNumberToUser1733702500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'phoneNumber',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'phoneNumber');
  }
}
```

### 4. Run Migration
```bash
pnpm run migration:run
```

---

## 📋 Current Status

### ✅ Completed
- [x] TypeORM configured in `app.module.ts`
- [x] Data source file created (`src/data-source.ts`)
- [x] Migration scripts added to `package.json`
- [x] User table migration created
- [x] Migration executed successfully
- [x] Database configuration in `.env`

### Migration History
```
✓ CreateUserTable1733702400000 - User table with id, name, email, password, isActive
```

---

## 🔧 Common Migration Tasks

### Add New Column
```typescript
await queryRunner.addColumn(
  'user',
  new TableColumn({
    name: 'createdAt',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  }),
);
```

### Modify Column
```typescript
await queryRunner.changeColumn(
  'user',
  'email',
  new TableColumn({
    name: 'email',
    type: 'varchar',
    length: '320', // Updated length
    isUnique: true,
  }),
);
```

### Add Index
```typescript
await queryRunner.createIndex(
  'user',
  new TableIndex({
    name: 'IDX_USER_EMAIL',
    columnNames: ['email'],
  }),
);
```

### Add Foreign Key
```typescript
await queryRunner.createForeignKey(
  'news',
  new TableForeignKey({
    columnNames: ['authorId'],
    referencedTableName: 'user',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
  }),
);
```

---

## ⚠️ Important Notes

1. **Never use `synchronize: true` in production**
   - It auto-syncs schema but can cause data loss
   - Always use migrations for production

2. **Always review generated migrations**
   - Auto-generated migrations may need adjustments
   - Check before running on production

3. **Test migrations on development first**
   - Run migrations on dev/staging before production
   - Keep backups before migrating production

4. **Migration order matters**
   - Migrations run in timestamp order
   - Don't modify old migrations after they've run

5. **Keep migrations in version control**
   - Commit migration files to git
   - Share migrations with team members

---

## 🗄️ Database Schema

### Current Tables

#### `user` table
| Column | Type | Constraints |
|--------|------|-------------|
| id | int | PRIMARY KEY, AUTO_INCREMENT |
| name | varchar(255) | NOT NULL |
| email | varchar(255) | NOT NULL, UNIQUE |
| password | varchar(255) | NOT NULL |
| isActive | boolean | DEFAULT true |

#### `migrations` table (TypeORM internal)
| Column | Type | Constraints |
|--------|------|-------------|
| id | int | PRIMARY KEY, AUTO_INCREMENT |
| timestamp | bigint | NOT NULL |
| name | varchar(255) | NOT NULL |

---

## 🔄 Next Steps

### Update Auth Service
Now that you have the User entity with TypeORM, update `auth.service.ts` to use the repository instead of in-memory storage:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = this.userRepository.create(signUpDto);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
}
```

### Create News Entity
Create a News entity with relation to User:
```typescript
@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, user => user.news)
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

Then generate and run migration:
```bash
pnpm run migration:generate src/migrations/CreateNewsTable
pnpm run migration:run
```

---

## 📚 Resources

- [TypeORM Migrations](https://typeorm.io/migrations)
- [NestJS TypeORM](https://docs.nestjs.com/techniques/database)
- [TypeORM DataSource](https://typeorm.io/data-source)

---

**Migration system is ready to use! 🎉**
