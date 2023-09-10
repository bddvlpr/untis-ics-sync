import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.get('CORS_ORIGIN') || 'http://localhost:5173',
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );

  SwaggerModule.setup(
    'swagger',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('untis-ics-sync')
        .setDescription(
          'Serves a calendar API (ICS) for events provided from Untis.',
        )
        .setVersion('0.0.1')
        .setLicense(
          'BSD-3-Clause',
          'https://joinup.ec.europa.eu/licence/bsd-3-clause-new-or-revised-license',
        )
        .setContact('Luna Simons', 'https://bddvlpr.com', 'luna@bddvlpr.com')
        .build(),
    ),
  );

  await app.listen(3000);
}
bootstrap();
