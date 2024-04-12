import * as request from 'supertest';
import { TestApp } from './utils/test-app';
import { e2eWebinars } from './seeds/webinar.seeds.e2e';
import { e2eUsers } from './seeds/user.seeds.e2e';
import { AbstractParticipationRepository } from '../participation/ports/abstract-participation-repository';
import { e2eParticipation } from './seeds/participation.seeds.e2e';

describe('Feature: canceling a seat', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([e2eUsers.charlesLeclerc, e2eUsers.johnDoe, e2eWebinars.johnDoe, e2eParticipation.charlesLeclerc]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: Happy path', () => {
    it('should succeed', async () => {
      const id = e2eWebinars.johnDoe.entity.props.id;

      const result = await request(app.getHttpServer())
        .delete(`/webinars/${id}/participations`)
        .set('Authorization', e2eUsers.charlesLeclerc.createAuthorizationToken());

      expect(result.status).toBe(204);

      const participationRepository = app.get<AbstractParticipationRepository>(AbstractParticipationRepository);
      const participation = await participationRepository.findOne(id, e2eUsers.charlesLeclerc.entity.props.id);

      expect(participation).toBeNull();
    });
  });

  describe('Scenario: user is not authenticated', () => {
    it('should reject', async () => {
      const id = e2eWebinars.johnDoe.entity.props.id;

      await request(app.getHttpServer()).delete(`/webinars/${id}/participations`).send().expect(403);
    });
  });
});
