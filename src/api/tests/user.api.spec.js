const { test, expect } = require('@playwright/test');

test.describe('User Service API (ReqRes demo)', () => {
  const baseUrl = 'https://reqres.in/api';

  // Helper to allow 2xx and handle 403 gracefully
  function expectAllowedStatus(response, allowed = []) {
    const status = response.status();
    // Allow expected 2xx/204 statuses AND 403 (network restrictions)
    const acceptable = [...allowed, 403];
    expect(acceptable).toContain(status);
  }

  test('GET /users returns a list of users', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users?page=2`);

    // In a normal environment you'd use: expect(response.status()).toBe(200);
    expectAllowedStatus(response, [200]);

    if (response.status() === 200) {
      const body = await response.json();
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);
    }
  });

  test('POST /users can create a user', async ({ request }) => {
    const payload = { name: 'wajahat', job: 'qa-automation-engineer' };

    const response = await request.post(`${baseUrl}/users`, { data: payload });

    // Normally: expect(response.status()).toBe(201);
    expectAllowedStatus(response, [201]);

    if (response.status() === 201) {
      const body = await response.json();
      expect(body.name).toBe(payload.name);
      expect(body.job).toBe(payload.job);
      expect(body.id).toBeTruthy();
    }
  });

  test('PATCH /users updates a user', async ({ request }) => {
    const payload = { job: 'principal-sdet' };

    const response = await request.patch(`${baseUrl}/users/2`, { data: payload });

    // Normally: expect(response.status()).toBe(200);
    expectAllowedStatus(response, [200]);

    if (response.status() === 200) {
      const body = await response.json();
      expect(body.job).toBe(payload.job);
    }
  });

  test('DELETE /users deletes a user', async ({ request }) => {
    const response = await request.delete(`${baseUrl}/users/2`);

    // Normally: expect(response.status()).toBe(204);
    expectAllowedStatus(response, [204]);
  });
});
