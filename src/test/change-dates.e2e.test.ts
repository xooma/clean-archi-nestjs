import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eUsers } from './seeds/user.seeds.e2e';
import { WebinarFixture } from './fixtures/webinar.fixture';
import { addDays } from 'date-fns';
import { AbstractWebinarRepository } from '../webinar/ports/abstract-webinar-repository';
import { Webinar } from '../webinar/entities/webinar.entity';

describe('Feature: changing the dates', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.johnDoe, new WebinarFixture(new Webinar({
      id: 'id-1',
      organizerId: 'john-doe',
      seats: 50,
      title: 'My first webinar',
      startDate: addDays(new Date(), 4),
      endDate: addDays(new Date(), 5),
    }))]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should succeed', async () => {
      const startDate = addDays(new Date(), 5);
      const endDate = addDays(new Date(), 5);
      const id = 'id-1';

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
      const endDate = addDays(new Date(), 5);      const id = 'id-1';

      await request(app.getHttpServer())
        .post(`/webinars/${id}/seats`)
        .send({ startDate, endDate })
        .expect(403);
    });
  });
});