import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'micatalogo-compose-'));
const fixture = join(temp, 'test.env');
const fields = {
  APP_KEY: `base64:${randomBytes(32).toString('base64')}`,
  DB_PASSWORD: randomBytes(32).toString('hex'),
  MYSQL_ROOT_PASSWORD: randomBytes(32).toString('hex'),
  MAIL_HOST: 'smtp.example.test', MAIL_USERNAME: 'test-user',
  MAIL_PASSWORD: randomBytes(16).toString('hex'), MAIL_FROM_ADDRESS: 'test@example.test',
};
let contents = readFileSync(join(root, '.env.production.example'), 'utf8');
for (const [key, value] of Object.entries(fields)) {
  contents = contents.replace(new RegExp(`^${key}=$`, 'm'), `${key}=${value}`);
}
writeFileSync(fixture, contents, { mode: 0o600 });
const env = { ...process.env, APP_ENV_FILE: fixture };
// Do not let host credentials interfere with the isolated Compose fixture.
for (const key of [...Object.keys(fields), 'DB_DATABASE', 'DB_USERNAME', 'COMPOSE_PROFILES']) delete env[key];
const compose = (...args) => spawnSync('docker', ['compose', '--env-file', fixture, '-f', 'docker-compose.yml', ...args], {
  cwd: root, env, encoding: 'utf8',
});
try {
  const run = compose('config', '--format', 'json');
  assert.equal(run.status, 0, 'Compose must resolve with explicit configuration');
  const config = JSON.parse(run.stdout);
  assert.deepEqual(Object.keys(config.services).sort(), ['api-web', 'app', 'db', 'front-web']);
  assert.equal(config.services.app.environment.APP_KEY, fields.APP_KEY);
  assert.equal(config.services.app.environment.DB_PASSWORD, config.services.db.environment.MYSQL_PASSWORD);
  assert.equal(config.services.app.environment.APP_ENV, 'production');
  assert.equal(String(config.services.app.environment.APP_DEBUG), 'false');
  assert.equal(config.services.app.environment.MAIL_HOST, fields.MAIL_HOST);
  assert.equal(config.services.app.depends_on.mailpit, undefined);
  assert.equal(config.services.db.ports, undefined);
  const tools = compose('--profile', 'tools', 'config', '--format', 'json');
  assert.equal(tools.status, 0);
  const withTools = JSON.parse(tools.stdout);
  for (const service of ['api-web', 'front-web', 'phpmyadmin', 'mailpit']) {
    for (const port of withTools.services[service].ports) assert.equal(port.host_ip, '127.0.0.1');
  }
  for (const key of ['APP_KEY', 'DB_PASSWORD', 'MYSQL_ROOT_PASSWORD', 'MAIL_HOST', 'MAIL_PASSWORD']) {
    writeFileSync(fixture, contents.replace(new RegExp(`^${key}=.*$`, 'm'), `${key}=`));
    assert.notEqual(compose('config', '--quiet').status, 0, `Missing ${key} must block deployment`);
  }
  console.log('PASS: Compose service selection, credentials, SMTP, loopback ports and missing-secret guards.');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
