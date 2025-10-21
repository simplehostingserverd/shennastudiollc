export async function GET() {
  try {
    // Basic health check
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'shenna-studio-frontend',
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    }

    // Return 200 OK with health data
    return Response.json(healthData, { status: 200 })
  } catch (error) {
    // Return 503 Service Unavailable if something goes wrong
    return Response.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'shenna-studio-frontend',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}

// Support HEAD requests for health checks
export async function HEAD() {
  return new Response(null, { status: 200 })
}
