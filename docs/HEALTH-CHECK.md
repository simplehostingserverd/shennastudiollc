# Health Check Documentation

## Overview

The frontend includes a robust health check endpoint at `/api/health` that Railway uses to monitor service health and determine if the application is ready to receive traffic.

## Endpoint

**URL**: `/api/health`
**Methods**: `GET`, `HEAD`
**Response Format**: JSON

## Response Schema

### Healthy Response (200 OK)

```json
{
  "status": "healthy",
  "timestamp": "2025-01-09T12:34:56.789Z",
  "service": "shenna-studio-frontend",
  "version": "1.0.0",
  "uptime": 123.45,
  "environment": "production"
}
```

### Unhealthy Response (503 Service Unavailable)

```json
{
  "status": "unhealthy",
  "timestamp": "2025-01-09T12:34:56.789Z",
  "service": "shenna-studio-frontend",
  "error": "Error message here"
}
```

## Testing the Health Check

### Local Testing

```bash
# Start the frontend
cd frontend
npm run dev

# Test health endpoint (in another terminal)
node scripts/test-health.js http://localhost:3000

# Or use curl
curl http://localhost:3000/api/health
```

### Production Testing

```bash
# Test on Railway
node frontend/scripts/test-health.js https://your-app.up.railway.app

# Or use curl
curl https://your-app.up.railway.app/api/health
```

### Expected Output

```bash
🏥 Testing health endpoint...
📍 URL: http://localhost:3000/api/health

Status Code: 200
✅ Health check PASSED

Health Data:
{
  "status": "healthy",
  "timestamp": "2025-01-09T12:34:56.789Z",
  "service": "shenna-studio-frontend",
  "version": "1.0.0",
  "uptime": 123.45,
  "environment": "development"
}

✨ Service is healthy!
```

## Railway Configuration

### railway.json

```json
{
  "deploy": {
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### How Railway Uses the Health Check

1. **During Deployment**: Railway waits for the health check to pass before routing traffic to the new deployment
2. **Continuous Monitoring**: Railway periodically checks the endpoint to ensure the service is healthy
3. **Automatic Restart**: If health checks fail consistently, Railway will restart the service
4. **Zero-Downtime**: New deployments only go live once health checks pass

### Health Check Timing

- **Initial Wait**: Railway waits up to 100 seconds for first successful health check
- **Check Interval**: Health check runs every 30 seconds after deployment
- **Failure Threshold**: 3 consecutive failures trigger a restart
- **Max Retries**: Service will restart up to 10 times on failure

## Implementation Details

### File Location

`frontend/app/api/health/route.ts`

### Features

- ✅ Returns 200 OK when healthy
- ✅ Returns 503 Service Unavailable when unhealthy
- ✅ Includes service metadata (uptime, environment, version)
- ✅ Supports both GET and HEAD requests
- ✅ Error handling with try-catch
- ✅ TypeScript type safety

### Code

```typescript
export async function GET() {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'shenna-studio-frontend',
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    }

    return Response.json(healthData, { status: 200 })
  } catch (error) {
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

export async function HEAD() {
  return new Response(null, { status: 200 })
}
```

## Troubleshooting

### Health Check Failing

**Symptoms**: Railway shows service as unhealthy, deployment stuck

**Possible Causes**:
1. App not starting correctly
2. Port mismatch (ensure PORT env var is set)
3. Build errors preventing startup
4. Missing dependencies

**Solutions**:
```bash
# Check Railway logs
railway logs

# Verify local health check works
npm run dev
curl http://localhost:3000/api/health

# Check environment variables
railway variables
```

### Health Check Times Out

**Symptoms**: Deployment times out waiting for health check

**Possible Causes**:
1. App takes too long to start
2. Health check timeout too short
3. Network issues

**Solutions**:
- Increase `healthcheckTimeout` in railway.json (max 300s)
- Optimize build time (use build cache)
- Check for slow dependencies in startup

### 503 Errors

**Symptoms**: Health endpoint returns 503

**Possible Causes**:
1. Uncaught errors in the route handler
2. Runtime errors during startup
3. Missing environment variables

**Solutions**:
```bash
# Check application logs
railway logs --filter error

# Test locally with production env
NODE_ENV=production npm start
curl http://localhost:3000/api/health
```

## Monitoring

### Railway Dashboard

1. Go to your service in Railway dashboard
2. Click "Deployments" tab
3. Check "Health Checks" section
4. View health check history and timing

### Custom Monitoring

You can set up external monitoring using services like:
- UptimeRobot
- Pingdom
- Better Uptime

Point them to: `https://your-app.up.railway.app/api/health`

## Best Practices

1. **Keep it Simple**: Health check should be fast (< 1 second)
2. **No External Deps**: Don't check backend/database in health check
3. **Return Quickly**: Use timeout of 100-300s for Railway
4. **Log Failures**: Add logging for health check failures
5. **Version Info**: Include version for debugging

## Future Enhancements

Possible improvements to the health check:

- Add readiness vs liveness checks
- Include more detailed metrics
- Check backend connectivity (optional)
- Add custom health check queries
- Report on build/deployment status

## Related Files

- `frontend/app/api/health/route.ts` - Health check implementation
- `frontend/railway.json` - Railway health check configuration
- `frontend/scripts/test-health.js` - Health check test script
- `docs/RAILWAY-FRONTEND-DEPLOYMENT.md` - Railway deployment guide
