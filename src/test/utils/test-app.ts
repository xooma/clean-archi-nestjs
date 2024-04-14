import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigModule } from '@nestjs/config';

import { CoreModule } from '../../core/core.module';
import { MongoUser } from '../../user/adapters/mongo/mongo-user';
import { IFixture } from './fixture.interface';
import { MongoWebinar } from '../../webinar/adapters/mongo/mongo-webinar';

export class TestApp {
  private app: INestApplication;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [
        CoreModule,
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          isGlobal: true,
          load: [
            () => ({
              DATABASE_URL: 'mongodb://admin:azerty@localhost:3701/webinars?authSource=admin',
            }),
          ],
        }),
      ],
    }).compile();

    this.app = module.createNestApplication();
    await this.app.init();

    await this.clearDatabase();
  }

  private async clearDatabase() {
    await this.app.get<Model<MongoUser.SchemaClass>>(
      getModelToken(MongoUser.CollectionName)
    ).deleteMany({});

    await this.app.get<Model<MongoWebinar.SchemaClass>>(
      getModelToken(MongoWebinar.CollectionName)
    ).deleteMany({});
  }

  async cleanup() {
    await this.app.close();
  }

  async loadFixtures(fixtures: IFixture[]) {
    return Promise.all(fixtures.map((fixture) => fixture.load(this)));
  }

  get<T>(name: any): T {
    return this.app.get<T>(name);
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }
}
