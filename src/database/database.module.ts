import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from './database.config';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'mysql',

        host: configService.get<string>('database.host'),

        port: configService.get<number>(
          'database.port',
        ),

        username: configService.get<string>(
          'database.username',
        ),

        password: configService.get<string>(
          'database.password',
        ),

        database: configService.get<string>(
          'database.database',
        ),

        autoLoadEntities: true,

        synchronize:
          configService.get<string>('NODE_ENV') ===
          'development',

        logging:
          configService.get<string>('NODE_ENV') ===
          'development',
      }),
    }),
  ],
})
export class DatabaseModule {}