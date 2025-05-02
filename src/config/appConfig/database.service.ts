import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      this.logger.log('✅ Database connection is already established.');
    } else {
      try {
        await this.dataSource.initialize();
        this.logger.log('✅ Database connection established successfully!');
      } catch (error) {
        this.logger.error('❌ Failed to connect to the database:', error);
        process.exit(1);
      }
    }
  }
}
