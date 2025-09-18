export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'shenna-studio-frontend',
    version: '1.0.0',
  })
}
