import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.config';
import { TypedConfigService } from '../services/typed-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvironmentVariables],
    }),
  ],
  providers: [TypedConfigService],
  exports: [TypedConfigService],
})
export class TypedConfigModule {}
