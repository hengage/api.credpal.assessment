import { DataSource } from 'typeorm';
import { DATA_SOURCE } from 'src/common/constants';
import { AppDataSource } from './data-source';

export const databaseProvider = [
  {
    provide: DATA_SOURCE,
    useFactory: async (): Promise<DataSource> => {
      return AppDataSource.initialize();
    },
  },
];
