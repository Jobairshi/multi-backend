import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { News } from './news.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, News])],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
