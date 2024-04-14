import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { TestApp } from '../../../test/utils/test-app';

import { MongoParticipation } from './mongo-participation';
import { MongoParticipationRepository } from './mongo-participation-repository';
import { testUsers } from '../../../user/tests/user.seeds';
import { Participation } from '../../entities/participation.entity';
import { testWebinars } from '../../../webinar/tests/webinar.seeds';
import { testParticipations } from '../../tests/participation.seed';

describe('MongoParticipationRepository', () => {
  async function createParticipationInDatabase(participation: Participation) {
    const record = new model({
      _id: MongoParticipation.SchemaClass.makeId(participation),
      userId: participation.props.userId,
      webinarId: participation.props.webinarId,
    });

    await record.save();
  }

  let app: TestApp;
  let model: Model<MongoParticipation.SchemaClass>;
  let repository: MongoParticipationRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    model = app.get<Model<MongoParticipation.Document>>(getModelToken(MongoParticipation.CollectionName));

    repository = new MongoParticipationRepository(model);

    await createParticipationInDatabase(testParticipations.billyBob);
  });

  describe('create', () => {
    it('should create a participation', async () => {
      await repository.create(testParticipations.aliceFoo);

      const record = await model.findOne({ userId: testUsers.aliceFoo.props.id });

      expect(record!.toObject()).toEqual({
        __v: 0,
        _id: `${testParticipations.aliceFoo.props.userId}:${testParticipations.aliceFoo.props.webinarId}`,
        userId: testUsers.aliceFoo.props.id,
        webinarId: testWebinars.billyBob.props.id,
      });
    });

    it('should fail if the webinar does not exist', async () => {
      await repository.create(
        new Participation({
          userId: testUsers.billyBob.props.id,
          webinarId: 'non-existing-webinar',
        }),
      );

      const participations = await model.findById(`${testUsers.billyBob.props.id}-non-existing-webinar`);

      expect(participations).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a participation', async () => {
      await repository.delete(testParticipations.billyBob);

      const record = await model.findOne({ userId: testUsers.billyBob.props.id });

      expect(record).toBeNull();
    });
  });

  describe('countParticipation', () => {
    it('should count participations', async () => {
      const count = await repository.countParticipations(testParticipations.billyBob.props.webinarId);

      expect(count).toEqual(1);
    });
  });

  describe('findOne', () => {
    it('should find entry', async () => {
      const participation = await repository.findOne(testUsers.billyBob.props.id, testWebinars.aliceFoo.props.id);

      expect(participation).toEqual(testParticipations.billyBob);
    });

    it('should fail if the webinar does not exist', async () => {
      const participation = await repository.findOne(testUsers.billyBob.props.id, 'non-existing-webinar');

      expect(participation).toBeNull();
    });
  });

  afterEach(async () => {
    await app.cleanup();
  });
});
