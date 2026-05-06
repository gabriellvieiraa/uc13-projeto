import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { execSync } from 'node:child_process';

describe('User integration - password change', () => {
  beforeAll(() => {
    // Ensure DB is migrated and seeded if needed
    try { execSync('npx prisma migrate deploy', { stdio: 'ignore' }); } catch(e) {}
  });

  it('should login director and change own password', async () => {
    // Create or ensure user exists - try login first
    const login = await request(app)
      .post('/user/login')
      .send({ email: 'vanessa@test.com', password: '1234567' });

    expect(login.status).toBe(200);
    const token = login.body.token;
    const userId = login.body.user.id;

    const res = await request(app)
      .put(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'novaSenhaForTest123' });

    expect([200,202]).toContain(res.status);
  });
});
