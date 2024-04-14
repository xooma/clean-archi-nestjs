import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IFixture } from './fixture.interface';
import { CoreModule } from '../../core/core.module';
import { ConfigModule } from '@nestjs/config';

export class TestApp {
  private app: INestApplication;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [CoreModule, ConfigModule.forRoot({
        ignoreEnvFile: true,
        ignoreEnvVars: true,
        isGlobal: true,
        load: [
          () => ({
            DATABASE_URL: 'mongodb://admin:azerty@localhost:3701/webinars?authSource=admin',
          })
        ],
      })],
    }).compile();

    this.app = module.createNestApplication();
    await this.app.init();
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