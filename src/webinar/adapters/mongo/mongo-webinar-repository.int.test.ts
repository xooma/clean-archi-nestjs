import { MongoWebinar } from './mongo-webinar';
import { Model } from 'mongoose';
import { MongoWebinarRepository } from './mongo-webinar-repository';
import { getModelToken } from '@nestjs/mongoose';
import { TestApp } from '../../../test/utils/test-app';
import { testWebinars } from '../../tests/webinar.seeds';
import { Webinar } from '../../entities/webinar.entity';

describe('MongoWebinarRepository', () => {
  let app: TestApp;
  let model: Model<MongoWebinar.SchemaClass>;
  let repository: MongoWebinarRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    model = app.get<Model<MongoWebinar.Document>>(getModelToken(MongoWebinar.CollectionName));

    repository = new MongoWebinarRepository(model);

    const record = new model({
      _id: testWebinars.aliceFoo.props.id,
      organizerId: testWebinars.aliceFoo.props.organizerId,
      title: testWebinars.aliceFoo.props.title,
      seats: testWebinars.aliceFoo.props.seats,
      startDate: testWebinars.aliceFoo.props.startDate,
      endDate: testWebinars.aliceFoo.props.endDate,
    });

    await record.save();
  });

  describe('findById', () => {
    it('should find the webinar corresponding to the id', async () => {
      const webinar = await repository.findById(testWebinars.aliceFoo.props.id);

      expect(webinar!.props).toEqual(testWebinars.aliceFoo.props);
    });

    it('should fail when the id does not exist', async () => {
      const webinar = await repository.findById('id-does-not-exist');

      expect(webinar).toBeNull();
    });
  });

  describe('Update', () => {
    it('should update the webinar', async () => {
      const webinarCopy: Webinar = <Webinar>testWebinars.aliceFoo.clone();
      webinarCopy.update({ seats: 100 });

      await repository.update(webinarCopy);

      const record = await model.findById(testWebinars.aliceFoo.props.id);
      expect(record!.toObject()).toEqual({
        __v: 0,
        _id: webinarCopy.props.id,
        organizerId: webinarCopy.props.organizerId,
        title: webinarCopy.props.title,
        seats: webinarCopy.props.seats,
        startDate: webinarCopy.props.startDate,
        endDate: webinarCopy.props.endDate,
      });
    });

    it('should fail when the webinar does not exist', async () => {
      const webinar = await repository.findById('id-does-not-exist');

      expect(webinar).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new webinar', async () => {
      await repository.create(testWebinars.billyBob);

      const record = await model.findById(testWebinars.billyBob.props.id);
      expect(record!.toObject()).toEqual({
        __v: 0,
        _id: testWebinars.billyBob.props.id,
        organizerId: testWebinars.billyBob.props.organizerId,
        title: testWebinars.billyBob.props.title,
        seats: testWebinars.billyBob.props.seats,
        startDate: testWebinars.billyBob.props.startDate,
        endDate: testWebinars.billyBob.props.endDate,
      });
    });
  });

  describe('delete', () => {
    it('should delete a new webinar', async () => {
      await repository.delete(testWebinars.aliceFoo);

      const record = await model.findById(testWebinars.billyBob.props.id);
      expect(record).toBeNull();
    });
  });
});