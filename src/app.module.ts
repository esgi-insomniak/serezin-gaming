import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationInterceptor } from './common/interceptors/pagination.interceptor';
import { ResponseFormaterInterceptor } from './common/interceptors/response-formater.interceptor';
import typeorm from './config/database/typeorm';
import { AuthGuard } from './guard/auth.guard';
import { TournamentModule } from './models/tournament/tournament.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
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
      useClass: ResponseFormaterInterceptor,
    },
  ],
})
export class AppModule {}
