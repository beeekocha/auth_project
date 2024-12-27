import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { createTestingApp } from './utils/createTestingApp';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mongoConnection: Connection;

  beforeEach(async () => {
    const testApp = await createTestingApp('auth_test');
    app = testApp.app;
    const moduleFixture = testApp.moduleFixture;
    mongoConnection = await moduleFixture.get(getConnectionToken());
  });

  afterEach(async () => {
    await mongoConnection.dropDatabase();
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    const signUpDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'Test123!@#',
    };

    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(signUpDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('jwt');
        });
    });

    it('should fail if email exists', async () => {
      // First create a user
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(signUpDto);

      // Try to create the same user again
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(signUpDto)
        .expect(409);
    });

    it('should fail with invalid password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          ...signUpDto,
          password: 'weak',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'Test123!@#',
    };

    beforeEach(async () => {
      // Create a user before testing login
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData);
    });

    it('should authenticate user with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('jwt');
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'WrongTest123!@#',
        })
        .expect(401);
    });
  });
});
