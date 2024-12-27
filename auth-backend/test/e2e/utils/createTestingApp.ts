import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../../src/app.module';

//Creating unique DB on each set of test so they don't drop each other
export const createTestingApp = async (
  dbSuffix: string,
): Promise<{
  app: INestApplication;
  moduleFixture: TestingModule;
}> => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ConfigService)
    .useFactory({
      factory: () => ({
        get: (key: string) => {
          if (key === 'MONGODB_URI') {
            const baseUri = process.env.MONGODB_URI;
            return `${baseUri}_${dbSuffix}_${Date.now()}`;
          }
          return process.env[key];
        },
      }),
    })
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');
  await app.init();

  return { app, moduleFixture };
};
