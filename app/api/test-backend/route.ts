export async function GET() {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9004'
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    // Test backend health
    const healthResponse = await fetch(`${backendUrl}/health`)
    const healthData = await healthResponse.json()

    // Test products endpoint
    const productsResponse = await fetch(
      `${backendUrl}/store/products?limit=1`,
      {
        headers: {
          'x-publishable-api-key': publishableKey || '',
        },
      }
    )
    const productsData = await productsResponse.json()

    return Response.json({
      status: 'success',
      backend_health: healthData,
      products_test: {
        status: productsResponse.status,
        count: productsData.count || 0,
        has_products: productsData.products?.length > 0,
      },
      config: {
        backend_url: backendUrl,
        has_publishable_key: !!publishableKey,
      },
    })
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        config: {
          backend_url: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
          has_publishable_key: !!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
        },
      },
      { status: 500 }
    )
  }
}
