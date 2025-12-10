import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './news.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}
  async create(
    createNewsDto: CreateNewsDto,
    user: {
      userId: string;
    },
  ): Promise<News> {
    console.log('🚀 ~ NewsService ~ create ~ user:', user);
    const newsItem: News = {
      id: randomUUID(),
      ...createNewsDto,
      userId: user.userId,
      createdAt: new Date(),
      views: 0,
    };
    console.log('🚀 ~ NewsService ~ create ~ newsItem:', newsItem);

    return await this.newsRepository.save(newsItem);
  }

  async findAll(): Promise<News[]> {
    return this.newsRepository.find();
  }

  async findOne(id: string): Promise<News> {
    const newsItem = await this.newsRepository.findOneBy({ id });
    if (!newsItem) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    // Increment views
    newsItem.views++;
    await this.newsRepository.save(newsItem);
    return newsItem;
  }

  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
    userId: string,
  ): Promise<News> {
    const newsItem = await this.newsRepository.findOneBy({ id });
    if (!newsItem) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    if (newsItem.userId !== userId) {
      throw new NotFoundException('You can only update your own news');
    }

    Object.assign(newsItem, updateNewsDto, { updatedAt: new Date() });
    return newsItem;
  }

  async remove(id: string, userId: string): Promise<void> {
    const newsItem = await this.newsRepository.findOneBy({ id });
    if (!newsItem) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    if (newsItem.userId !== userId) {
      throw new NotFoundException('You can only delete your own news');
    }

    await this.newsRepository.remove(newsItem);
  }

  async findByAuthor(userId: string): Promise<News[]> {
    const res = await this.newsRepository.findBy({ userId });
    return res;
  }
}
