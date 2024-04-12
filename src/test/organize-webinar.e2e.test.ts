import * as request from 'supertest';
import { addDays } from 'date-fns';
import { TestApp } from './utils/test-app';
import { e2eUsers } from './seeds/user.seeds.e2e';
import { AbstractWebinarRepository } from '../webinar/ports/abstract-webinar-repository';

describe('Feature: organizing a webinar', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should succeed', async () => {
      const startDate = addDays(new Date(), 4);
      const endDate = addDays(new Date(), 5);

      const result = await request(app.getHttpServer())
        .post('/webinars')
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send({
          title: 'My first webinar',
          seats: 100,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(result.status).toBe(201);
      expect(result.body).toEqual({ id: expect.any(String) });

      const webinarRepository = app.get<AbstractWebinarRepository>(
        AbstractWebinarRepository,
      );
      const webinar = await webinarRepository.findById(result.body.id);

      expect(webinar).toBeDefined();
      expect(webinar!.props).toEqual({
        id: result.body.id,
        organizerId: e2eUsers.johnDoe.entity.props.id,
        title: 'My first webinar',
        seats: 100,
        startDate: startDate,
        endDate: endDate,
      });
    });
  });

  describe('Scenario: user is not authenticated', () => {
    it('should reject', async () => {
      await request(app.getHttpServer())
        .post('/webinars')
        .send({
          title: 'My first webinar',
          seats: 100,
          startDate: addDays(new Date(), 4).toISOString(),
          endDate: addDays(new Date(), 5).toISOString(),
        })
        .expect(403);
    });
  });
});