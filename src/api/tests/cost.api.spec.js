const { test, expect } = require('@playwright/test');

// Local C# COST API (run with: dotnet run in enterprise-data-simulation/csharp-api)
const BASE_URL = process.env.LOCAL_COST_API_URL || 'http://localhost:5050/api/costs';

// Marked skip so CI does not depend on local C# API running
test.describe.skip('COST Service API (local C# mock)', () => {

  test('GET /api/costs returns a list of costs', async ({ request }) => {
    const response = await request.get(BASE_URL);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('POST /api/costs creates a new cost', async ({ request }) => {
    const payload = {
      id: 0,
      name: 'Test Cost',
      department: 'QA',
      amount: 123.45,
      currency: 'USD'
    };

    const response = await request.post(BASE_URL, { data: payload });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.department).toBe(payload.department);
  });

  test('PATCH /api/costs/{id} updates an existing cost', async ({ request }) => {
    const update = {
      id: 0,
      name: 'Updated Cost',
      department: 'IT',
      amount: 999.99,
      currency: 'USD'
    };

    const response = await request.patch(`${BASE_URL}/1`, { data: update });
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.name).toBe(update.name);
    expect(body.amount).toBe(update.amount);
  });

  test('DELETE /api/costs/{id} deletes a cost', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/1`);
    expect([204, 404]).toContain(response.status());
  });

});
