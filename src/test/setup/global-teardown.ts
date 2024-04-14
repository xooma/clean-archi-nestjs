import { stopDocker } from './docker-manager';

const globalTeardown = async () => {
  await stopDocker();
};

export default globalTeardown;