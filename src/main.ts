import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as fs from 'fs';
import helmet from 'helmet';
import * as requestIp from 'request-ip';
import * as yaml from 'yaml';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Serezin-Gaming docs')
    .setVersion('1.0')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();

  if (process.env.NODE_ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
    fs.writeFileSync(
      './swagger-spec.yaml',
      yaml.stringify(document, { indent: 2 }),
    );
  }

  app.useGlobalPipes(
    new ValidationPipe(),
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(compression());
  app.use(helmet());
  app.use(requestIp.mw());
  // app.enableCors({ origin: new ConfigService().get('corsOrigin') });
  // await app.listen(new ConfigService().get('port'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
