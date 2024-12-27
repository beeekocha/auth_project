import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { createTestingApp } from './utils/createTestingApp';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let mongoConnection: Connection;

  beforeEach(async () => {
    const testApp = await createTestingApp('user_test');
    app = testApp.app;
    const moduleFixture = testApp.moduleFixture;
    mongoConnection = await moduleFixture.get(getConnectionToken());
  });

  afterEach(async () => {
    await mongoConnection.dropDatabase();
    await app.close();
  });

  describe('/user/profile (POST)', () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'Test123!@#',
    };

    it('Should get user profile if valid JWT', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData);

      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('jwt');
        });

      await request(app.getHttpServer())
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${loginRes.body.jwt}`)
        .send()
        .expect(200)
        .expect((res) => {
          expect(res.body).toStrictEqual({
            id: expect.any(String),
            email: userData.email,
            name: userData.name,
          });
        });
    });

    it('should fail with invalid credentials', async () => {
      await request(app.getHttpServer())
        .get('/api/user/profile')
        .set('Authorization', `Bearer randomString`)
        .send()
        .expect(401)
        .expect((res) => {
          expect(res.body).toStrictEqual({
            message: 'Unauthorized',
            statusCode: 401,
          });
        });
    });
  });
});
