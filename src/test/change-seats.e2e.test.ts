import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eWebinars } from './seeds/webinar.seeds.e2e';
import { e2eUsers } from './seeds/user.seeds.e2e';
import { AbstractWebinarRepository } from '../webinar/ports/abstract-webinar-repository';

describe('Feature: changing the number of seats', () => {
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
      const seats = 100;
      const id = 'id-1';

      const result = await request(app.getHttpServer())
        .post(`/webinars/${id}/seats`)
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send({ seats });

      expect(result.status).toBe(200);

      const webinarRepository = app.get<AbstractWebinarRepository>(
        AbstractWebinarRepository,
      );
      const webinar = await webinarRepository.findById(id);

      expect(webinar).toBeDefined();
      expect(webinar!.props.seats).toEqual(seats);
    });
  });

  describe('Scenario: user is not authenticated', () => {
    it('should reject', async () => {
      const seats = 100;
      const id = 'id-1';

      await request(app.getHttpServer())
        .post(`/webinars/${id}/seats`)
        .send({ seats })
        .expect(403);
    });
  });
});