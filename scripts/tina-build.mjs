import { spawnSync } from 'node:child_process';

const hasTinaCloudConfig = Boolean(process.env.TINA_PUBLIC_CLIENT_ID && process.env.TINA_TOKEN);
const args = hasTinaCloudConfig
  ? ['tinacms', 'build', '--content=local', '--skip-indexing', '--skip-search-index']
  : ['tinacms', 'build', '--local', '--skip-cloud-checks', '--skip-indexing', '--skip-search-index'];

if (!hasTinaCloudConfig) {
  console.warn('TinaCMS: TINA_PUBLIC_CLIENT_ID/TINA_TOKEN not found. Building a local admin preview.');
}

const result = spawnSync('npx', args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --max-old-space-size=4096`.trim()
  }
});

process.exit(result.status ?? 1);
