// Environment variable check endpoint
// This helps debug if environment variables are being loaded correctly

export async function GET() {
  const envVars = {
    hasBackendUrl: !!process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    backendUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'NOT SET',
    hasPublishableKey: !!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    publishableKeyPrefix: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY?.substring(0, 15) || 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    buildTime: new Date().toISOString(),
  }

  return Response.json(envVars, { status: 200 })
}
