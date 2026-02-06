import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  private client: RedisClientType;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    const host = this.configService.get<string>('REDIS_HOST', 'redis');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD');

    this.client = redisUrl
      ? createClient({ url: redisUrl })
      : createClient({
          password,
          socket: { host, port },
        });

    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    this.client.connect();
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, value, { EX: ttlSeconds });
      return;
    }

    await this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  async setJson(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }
}
