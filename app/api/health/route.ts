import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { analyticsTable } from '@/src/lib/db/schema';

/**
 * Health Check Endpoint
 *
 * @route GET /api/health
 * @returns {object} Health status with database connectivity and timestamp
 */
async function getDatabaseHealth() {
  try {
    // Basic connectivity check using the analyticsTable
    await db.select().from(analyticsTable).limit(1);

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      message: 'Hello World Backend',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Database connection failed in health check:', error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export { getDatabaseHealth as GET };
