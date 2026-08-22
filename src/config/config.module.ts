import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import databaseConfig from '../database/database.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      cache: true,

      load: [
        databaseConfig,
      ],
    }),
  ],

  exports: [
    ConfigModule,
  ],
})
export class AppConfigModule {}