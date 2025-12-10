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
  Inject,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Cache,
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @GetUser()
    user: {
      userId: string;
    },
  ) {
    const result = await this.newsService.create(createNewsDto, user);

    await this.cacheManager.del('news_all');
    await this.cacheManager.clear();
    console.log('✅ Cache cleared after creating news');

    return result;
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('news_all')
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
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @GetUser()
    user: {
      userId: string;
    },
  ) {
    const result = await this.newsService.update(
      id,
      updateNewsDto,
      user.userId,
    );

    await this.cacheManager.del('news_all');
    await this.cacheManager.clear();

    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @GetUser()
    user: {
      userId: string;
    },
  ) {
    const result = await this.newsService.remove(id, user.userId);

    await this.cacheManager.del('news_all');
    await this.cacheManager.clear();

    return result;
  }
}
