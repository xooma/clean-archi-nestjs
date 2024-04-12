import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eWebinars } from './seeds/webinar.seeds.e2e';
import { e2eUsers } from './seeds/user.seeds.e2e';
import { AbstractParticipationRepository } from '../participation/ports/abstract-participation-repository';

describe('Feature: reserving a seat for the webinar', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.charlesLeclerc, e2eUsers.johnDoe, e2eWebinars.johnDoe]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should succeed', async () => {
      const id = 'id-1';

      const result = await request(app.getHttpServer())
        .post(`/webinars/${id}/participations`)
        .set('Authorization', e2eUsers.charlesLeclerc.createAuthorizationToken());

      expect(result.status).toBe(201);

      const participationRepository = app.get<AbstractParticipationRepository>(AbstractParticipationRepository);
      const participation = await participationRepository.findOne(id, e2eUsers.charlesLeclerc.entity.props.id);

      expect(participation).toBeNull();
    });
  });

  describe('Scenario: user is not authenticated', () => {
    it('should reject', async () => {
      const id = 'id-1';

      await request(app.getHttpServer()).post(`/webinars/${id}/participations`).send().expect(403);
    });
  });
});
