import { build } from 'vite';

process.env.NODE_ENV = 'production';
delete process.env.VITE_USER_NODE_ENV;

try {
  await build();
} catch (error) {
  console.error(error);
  process.exit(1);
}
