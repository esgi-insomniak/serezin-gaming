import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypedConfigModule } from 'src/common/modules/typed-config.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [TypedConfigModule, HttpModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
