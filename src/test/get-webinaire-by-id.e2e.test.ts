import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eWebinars } from './seeds/webinar.seeds.e2e';
import { e2eUsers } from './seeds/user.seeds.e2e';

describe('Feature: getting a webinar by its id', () => {
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
      const webinar = e2eWebinars.johnDoe.entity.props;
      const organizer = e2eUsers.johnDoe.entity.props;
      const id = e2eWebinars.johnDoe.entity.props.id;

      const result = await request(app.getHttpServer())
        .get(`/webinars/${id}`)
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken());

      expect(result.status).toBe(200);
      expect(result.body).toEqual({
        id: webinar.id,
        organizer: {
          id: organizer.id,
          emailAddress: organizer.emailAdress,
        },
        title: webinar.title,
        startDate: webinar.startDate.toISOString(),
        endDate: webinar.endDate.toISOString(),
        seats: {
          reserved: 0,
          available: webinar.seats,
        },
      });
    });
  });

  describe('Scenario: user is not authenticated', () => {
    it('should reject', async () => {
      const id = e2eWebinars.johnDoe.entity.props.id;

      await request(app.getHttpServer()).get(`/webinars/${id}`).send().expect(403);
    });
  });
});
