import { startDocker } from './docker-manager';

const globalSetup = async () => {
  await startDocker();
};

export default globalSetup;