import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  constructor(protected readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { configService } = this;
    console.log('create option');
    console.log(configService.getOrThrow('POSTGRES_USER'));
    return {
      type: 'postgres',
      host: configService.getOrThrow('POSTGRES_HOST'),
      port: configService.getOrThrow('POSTGRES_PORT'),
      username: configService.getOrThrow('POSTGRES_USER'),
      password: configService.getOrThrow('POSTGRES_PASSWORD'),
      database: configService.getOrThrow('POSTGRES_DB'),
      autoLoadEntities: true,
    };
  }
}
