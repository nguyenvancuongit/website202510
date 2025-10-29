import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';
import { appConfig } from '../common/config';

@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  private client: any = null;

  private getClient() {
    if (!this.client) {
      const { redisUrl } = appConfig.cacheConfig;
      this.client = createClient({ url: redisUrl });
      this.client.on('error', (err) => {
        console.error('Redis Client Error', err);
      });
      this.client.connect().catch((err) => {
        console.error('Redis connect error', err);
      });
    }
    return this.client;
  }

  async get<T = any>(key: string): Promise<T | null> {
    const client = this.getClient();
    const namespacedKey = this.addPrefix(key);
    const raw = await client.get(namespacedKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const client = this.getClient();
    const namespacedKey = this.addPrefix(key);
    const payload = this.serialize(value);
    const ttl = ttlSeconds ?? appConfig.cacheConfig.defaultTtlSeconds;
    await client.set(namespacedKey, payload, { EX: ttl });
  }

  async del(key: string): Promise<void> {
    const client = this.getClient();
    const namespacedKey = this.addPrefix(key);
    await client.del(namespacedKey);
  }

  async invalidateByPattern(pattern: string): Promise<void> {
    const client = this.getClient();
    const prefix = appConfig.cacheConfig.keyPrefix;
    const fullPattern = `${prefix}${pattern}`;
    const iter = client.scanIterator({ MATCH: fullPattern, COUNT: 100 });
    for await (const k of iter) {
      await client.del(k as string);
    }
  }

  private addPrefix(key: string): string {
    const prefix = appConfig.cacheConfig.keyPrefix;
    return `${prefix}${key}`;
  }

  private serialize(value: any): string {
    return JSON.stringify(value, (_key, val) => {
      if (typeof val === 'bigint') {
        return val.toString();
      }
      return val;
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}
