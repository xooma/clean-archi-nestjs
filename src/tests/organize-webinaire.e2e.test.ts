import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { addDays } from 'date-fns';

import { AppModule } from '../app/app.module';
import { User } from '../entities';
import {
  InMemoryUserRepository,
  InMemoryWebinaireRepository,
} from '../adapters';
import { INestApplication } from '@nestjs/common';

describe('Feature: organizing a webinaire', () => {
  let app: INestApplication;

  const johnDoe = new User({
    id: 'john-doe',
    email: 'johndoe@gmail.com',
    password: 'azerty',
  });

  const token = Buffer.from(
    `${johnDoe.props.email}:${johnDoe.props.password}`,
  ).toString('base64');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const repository = app.get(InMemoryUserRepository);
    await repository.create(johnDoe);
  });

  afterEach(async () => {
    await app.close();
  })

  describe('Scenario: Happy path', () => {
    it('should create the webinaire', async () => {
      const startDate = addDays(new Date(), 4);
      const endDate = addDays(new Date(), 5);

      const result = await request(app.getHttpServer())
        .post('/webinaires')
        .set('Authorization', `Basic ${token}`)
        .send({
          title: 'My first webinaire',
          seats: 100,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(result.status).toBe(201);
      expect(result.body).toEqual({ id: expect.any(String) });

      const webinaireRepository = app.get(InMemoryWebinaireRepository);
      const webinaire = webinaireRepository.database[0];

      expect(webinaire).toBeDefined();
      expect(webinaire.props).toEqual({
        id: result.body.id,
        organizerId: 'john-doe',
        title: 'My first webinaire',
        seats: 100,
        startDate: startDate,
        endDate: endDate,
      });
    });
  });

  describe('Scenario: user is not authenticated', () => {
    it('should reject', async () => {
      await request(app.getHttpServer())
        .post('/webinaires')
        .send({
          title: 'My first webinaire',
          seats: 100,
          startDate: addDays(new Date(), 4).toISOString(),
          endDate: addDays(new Date(), 5).toISOString(),
        })
        .expect(403);
    });
  });
});