import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('news')
@UseInterceptors(CacheInterceptor)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createNewsDto: CreateNewsDto,
    @GetUser()
    user: {
      userId: string;
    },
  ) {
    return this.newsService.create(createNewsDto, user);
  }

  @Get()
  @CacheTTL(60) // Cache for 60 seconds
  findAll() {
    return this.newsService.findAll();
  }

  @Get('my-news')
  @UseGuards(JwtAuthGuard)
  findMyNews(@GetUser() user: { userId: string }) {
    return this.newsService.findByAuthor(user.userId);
  }

  @Get(':id')
  @CacheTTL(30) // Cache individual news for 30 seconds
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @GetUser()
    user: {
      userId: string;
    },
  ) {
    return this.newsService.update(id, updateNewsDto, user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @GetUser()
    user: {
      userId: string;
    },
  ) {
    return this.newsService.remove(id, user.userId);
  }
}
