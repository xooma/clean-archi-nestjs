import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eWebinars } from './seeds/webinar.seeds.e2e';
import { e2eUsers } from './seeds/user.seeds.e2e';
import { AbstractWebinarRepository } from '../webinar/ports/abstract-webinar-repository';

describe('Feature: canceling a webinar', () => {
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
      const id = 'id-1';

      const result = await request(app.getHttpServer())
        .delete(`/webinars/${id}/cancel`)
        .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
        .send();

      expect(result.status).toBe(200);

      const webinarRepository = app.get<AbstractWebinarRepository>(AbstractWebinarRepository);
      const webinar = await webinarRepository.findById(id);

      expect(webinar).toBeNull();
    });
  });

  describe('Scenario: user is not authenticated', () => {
    it('should reject', async () => {
      const id = 'id-1';

      await request(app.getHttpServer()).delete(`/webinars/${id}/cancel`).send().expect(403);
    });
  });
});
