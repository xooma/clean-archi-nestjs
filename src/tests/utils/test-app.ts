import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IFixture } from './fixture.interface';
import { CoreModule } from '../../core/core.module';

export class TestApp {
  private app: INestApplication;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [CoreModule],
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