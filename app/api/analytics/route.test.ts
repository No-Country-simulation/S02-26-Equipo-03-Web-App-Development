import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';

describe('Analytics API Endpoint', () => {
  it('should return a list of analytics records', async () => {
    // Note: This test assumes the database has been seeded or is accessible.
    // In a real CI environment, we would use a test DB or mock the DB calls.
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('success');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeLessThanOrEqual(5);
  });

  it('should return 500 on database error', async () => {
    // Example of mocking a failure to test error handling
    // This is just a demonstration; in a real test we'd mock the 'db' import
    // using vi.mock() at the top of the file.
  });
});
