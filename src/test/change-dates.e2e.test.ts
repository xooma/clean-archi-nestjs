import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eUsers } from './seeds/user.seeds.e2e';
import { WebinarFixture } from './fixtures/webinar.fixture';
import { addDays } from 'date-fns';
import { AbstractWebinarRepository } from '../webinar/ports/abstract-webinar-repository';
import { Webinar } from '../webinar/entities/webinar.entity';
import { e2eWebinars } from './seeds/webinar.seeds.e2e';

describe('Feature: changing the dates', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe, e2eWebinars.johnDoe]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should succeed', async () => {
      const startDate = addDays(new Date(), 5);
      const endDate = addDays(new Date(), 5);
      const id = e2eWebinars.johnDoe.entity.props.id;

      const result = await request(app.getHttpServer())
        .post(`/webinars/${id}/dates`)
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send({ startDate, endDate });

      expect(result.status).toBe(200);

      const webinarRepository = app.get<AbstractWebinarRepository>(
        AbstractWebinarRepository,
      );
      const webinar = await webinarRepository.findById(id);

      expect(webinar).toBeDefined();
      expect(webinar!.props.startDate).toEqual(startDate);
      expect(webinar!.props.endDate).toEqual(endDate);
    });
  });

  describe('Scenario: user is not authenticated', () => {
    it('should reject', async () => {
      const startDate = addDays(new Date(), 5);
      const endDate = addDays(new Date(), 5);
      const id = e2eWebinars.johnDoe.entity.props.id;

      await request(app.getHttpServer())
        .post(`/webinars/${id}/seats`)
        .send({ startDate, endDate })
        .expect(403);
    });
  });
});