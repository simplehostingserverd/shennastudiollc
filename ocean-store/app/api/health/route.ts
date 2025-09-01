import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Perform basic health checks
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'shenna-studio-frontend',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'unknown',
      uptime: process.uptime(),
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        error: 'Health check failed' 
      }, 
      { status: 500 }
    );
  }
}