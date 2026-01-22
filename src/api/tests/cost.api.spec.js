// ------------------------------------------------------------
// PURPOSE:
// Playwright API tests for the COST service.
// These tests validate CRUD behavior against a local
// C# Minimal API backend (in-memory repository).
//
// NOTE:
// The test suite is skipped so CI/CD does not depend on
// a locally running .NET service.
// ------------------------------------------------------------

const { test, expect } = require('@playwright/test');

// ------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------

// Base URL for the COST API
// Can be overridden via environment variable for flexibility
// Example: LOCAL_COST_API_URL=http://localhost:5050/api/costs
const BASE_URL =
  process.env.LOCAL_COST_API_URL || 'http://localhost:5050/api/costs';

// ------------------------------------------------------------
// TEST SUITE
// ------------------------------------------------------------

// Entire suite is skipped intentionally
// This prevents CI failures if the local C# API is not running
test.describe.skip('COST Service API (local C# mock)', () => {

  // ----------------------------------------------------------
  // GET /api/costs
  // ----------------------------------------------------------
  test('GET /api/costs returns a list of costs', async ({ request }) => {
    // Send GET request to retrieve all cost records
    const response = await request.get(BASE_URL);

    // Validate HTTP success
    expect(response.ok()).toBeTruthy();

    // Parse JSON response body
    const body = await response.json();

    // Validate response structure
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  // ----------------------------------------------------------
  // POST /api/costs
  // ----------------------------------------------------------
  test('POST /api/costs creates a new cost', async ({ request }) => {
    // Payload representing a new cost entry
    // ID is ignored by backend and auto-generated
    const payload = {
      id: 0,
      name: 'Test Cost',
      department: 'QA',
      amount: 123.45,
      currency: 'USD'
    };

    // Send POST request to create a new cost
    const response = await request.post(BASE_URL, { data: payload });

    // Validate correct REST behavior (201 Created)
    expect(response.status()).toBe(201);

    // Validate response body matches input
    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.department).toBe(payload.department);
  });

  // ----------------------------------------------------------
  // PATCH /api/costs/{id}
  // ----------------------------------------------------------
  test('PATCH /api/costs/{id} updates an existing cost', async ({ request }) => {
    // Updated cost data
    const update = {
      id: 0,
      name: 'Updated Cost',
      department: 'IT',
      amount: 999.99,
      currency: 'USD'
    };

    // Update cost with ID = 1
    const response = await request.patch(`${BASE_URL}/1`, { data: update });

    // Validate successful update
    expect(response.ok()).toBeTruthy();

    // Validate updated fields in response
    const body = await response.json();
    expect(body.name).toBe(update.name);
    expect(body.amount).toBe(update.amount);
  });

  // ----------------------------------------------------------
  // DELETE /api/costs/{id}
  // ----------------------------------------------------------
  test('DELETE /api/costs/{id} deletes a cost', async ({ request }) => {
    // Attempt to delete cost with ID = 1
    const response = await request.delete(`${BASE_URL}/1`);

    // Acceptable outcomes:
    // 204 -> deleted successfully
    // 404 -> record already deleted (idempotent behavior)
    expect([204, 404]).toContain(response.status());
  });

});
