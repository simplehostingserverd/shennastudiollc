import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // Simple health check - just return 200 if the server is running
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'medusa-backend',
  })
}
