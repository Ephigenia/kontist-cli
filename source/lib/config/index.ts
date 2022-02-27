import { schema } from './schema';
import { KontistCliConfiguration } from './class';

const config = new KontistCliConfiguration({
  projectName: 'kontist-cli-dev',
  projectVersion: '0.0.0-dev',
  schema,
});

export default config;
