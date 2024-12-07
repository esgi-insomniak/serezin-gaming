import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as express from 'express';
import * as fs from 'fs';
import helmet from 'helmet';
import * as https from 'https';
import * as requestIp from 'request-ip';
import * as yaml from 'yaml';
import { AppModule } from './app.module';
import { TypedConfigService } from './common/services/typed-config.service';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // LOAD CONFIG FOR ENV
  const configService = app.get<TypedConfigService>(TypedConfigService);

  // SWAGGER CONFIG
  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Serezin-Gaming docs')
      .setOpenAPIVersion('3.1.0')
      .setVersion('1.0')
      .addBearerAuth(undefined, 'defaultBearerAuth')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
    fs.writeFileSync(
      './swagger-spec.yaml',
      yaml.stringify(document, { indent: 2, singleQuote: true }),
    );
  }

  app.useGlobalPipes(
    new ValidationPipe(),
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: configService.get('cors.allowOrigin'),
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // USE MIDDLEWARE
  app.use(compression());
  app.use(helmet());
  app.use(requestIp.mw());

  await app.init();

  // INIT SERVER AS HTTPS
  https
    .createServer(
      {
        key: fs.readFileSync(configService.get('ssl.keyPath')),
        cert: fs.readFileSync(configService.get('ssl.certPath')),
      },
      server,
    )
    .listen(configService.get('port'));
}
bootstrap();
