import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import { ENV } from '../../../config/env';
import { EnvironmentKeys } from 'src/config/config.service';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  private client: RedisClientType;

  constructor() {
    const redisUrl = ENV.REDIS_URL as EnvironmentKeys;
    const host = ENV.REDIS_HOST as EnvironmentKeys;
    const port = ENV.REDIS_PORT as number;
    const password = ENV.REDIS_PASSWORD as EnvironmentKeys;

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
