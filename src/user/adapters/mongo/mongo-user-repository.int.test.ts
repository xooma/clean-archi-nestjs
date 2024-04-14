import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { testUsers } from '../../tests/user.seeds';
import { TestApp } from '../../../test/utils/test-app';
import { User } from '../../entities/user.entity';

import { MongoUser } from './mongo-user';
import { MongoUserRepository } from './mongo-user-repository';

describe('MongoUserRepository', () => {
  async function createUserInDatabase(user: User) {
    const model = app.get<Model<MongoUser.Document>>(getModelToken(MongoUser.CollectionName));
    const record = new model({
      _id: user.props.id,
      emailAdress: user.props.emailAdress,
      password: user.props.password,
    });

    await record.save();
  }

  let app: TestApp;
  let model: Model<MongoUser.SchemaClass>;
  let repository: MongoUserRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    model = app.get<Model<MongoUser.Document>>(getModelToken(MongoUser.CollectionName));

    repository = new MongoUserRepository(model);

    await createUserInDatabase(testUsers.aliceFoo);
  })

  describe('findByEmailAdress', () => {
    it('should find the user corresponding to the email address', async () => {
      const user = await repository.findByEmailAdress(testUsers.aliceFoo.props.emailAdress);
      expect(user!.props).toEqual(testUsers.aliceFoo.props);
    });

    it('should fail when the emailAdress is not registered', async () => {
      const user = await repository.findByEmailAdress('does-not-exist@gmail.com');
      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find the user corresponding to the id', async () => {
      const user = await repository.findById(testUsers.aliceFoo.props.id);
      expect(user!.props).toEqual(testUsers.aliceFoo.props);
    });

    it('should fail when the id does not exist', async () => {
      const user = await repository.findById('id-does-not-exist');
      expect(user).toBeNull();
    });
  });

  describe('create', () => {
    it('should create user', async () => {
      await repository.create(testUsers.billyBob);

      const record = await model.findById(testUsers.billyBob.props.id);
      expect(record!.toObject()).toEqual({
        __v: 0,
        _id: testUsers.billyBob.props.id,
        emailAdress: testUsers.billyBob.props.emailAdress,
        password: testUsers.billyBob.props.password,
      });
    });
  });

  afterEach(async () => {
    await app.cleanup();
  });
});