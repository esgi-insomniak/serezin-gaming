import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationInterceptor } from './common/interceptors/pagination.interceptor';
import {
  ExceptionFormaterInterceptor,
  ResponseFormaterInterceptor,
} from './common/interceptors/response-formater.interceptor';
import { TypedConfigModule } from './common/modules/typed-config.module';
import TypeORMConfig from './config/database/typeorm.config';
import { AuthGuard } from './guard/auth.guard';
import { AuthenticationModule } from './models/authentication/authentication.module';
import { TournamentModule } from './models/tournament/tournament.module';

@Module({
  imports: [
    TypedConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TypeORMConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    AuthenticationModule,
    TournamentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PaginationInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionFormaterInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormaterInterceptor,
    },
  ],
})
export class AppModule {}
