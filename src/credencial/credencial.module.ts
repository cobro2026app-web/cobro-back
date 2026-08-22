import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Credencial } from './entities/credencial.entity';

import { CredencialController } from './credencial.controller';
import { CredencialService } from './credencial.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Credencial,
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        secret:
          configService.get<string>(
            'JWT_SECRET',
          ),

        signOptions: {
          expiresIn:
            configService.get<number>(
              'JWT_EXPIRES_IN',
            ) ?? 3600,
        },
      }),
    }),
  ],

  controllers: [
    CredencialController,
  ],

  providers: [
    CredencialService,
        JwtStrategy,

  ],

  exports: [
    CredencialService,
  ],
})
export class CredencialModule {}