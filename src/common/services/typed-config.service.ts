import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LeafTypes, Leaves } from 'src/common/interfaces/config.intercae';
import { EnvironmentVariables } from 'src/config/env.config';

@Injectable()
export class TypedConfigService {
  constructor(private configService: ConfigService) {}

  get<T extends Leaves<EnvironmentVariables>>(
    propertyPath: T,
  ): LeafTypes<EnvironmentVariables, T> {
    return this.configService.get(propertyPath);
  }
}
