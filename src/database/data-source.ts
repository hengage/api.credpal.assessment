import { join } from 'path';
import { EnvironmentKeys } from 'src/config/config.service';
import { DataSource } from 'typeorm';
import { ENV } from '../config/env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DATABASE_HOST as EnvironmentKeys,
  port: +ENV.DATABASE_PORT,
  username: ENV.DATABASE_USERNAME as EnvironmentKeys,
  password: ENV.DATABASE_PASSWORD as EnvironmentKeys,
  database: ENV.DATABASE_NAME as EnvironmentKeys,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../../migrations/*{.ts,.js}')],
  migrationsRun: false,
  logging: false,
  poolSize: 50,
  extra: {
    connectionLimit: 50, // Max connections in pool
    waitForConnections: true, // Queue requests when pool is full
    queueLimit: 100, // Limit queue to 100 pending requests
    connectTimeout: 10000,
    // acquireTimeout: 10000,
    // debug: true,
  },
});
