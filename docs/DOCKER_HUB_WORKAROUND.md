# Docker Hub 503 Error Workaround

## Problem
Docker Hub's authentication service (auth.docker.io) is returning 503 Service Unavailable errors, preventing builds from pulling base images.

## Solutions Attempted

### 1. ✅ Using Image Digests (Current)
The Dockerfiles now use SHA256 digests instead of tags to bypass the authentication service.

**Files:**
- `frontend/Dockerfile` - Uses node alpine digest
- `backend/Dockerfile` - Uses node bookworm digest

**Pros:**
- Bypasses tag resolution
- More reproducible builds
- Works if Docker Hub's blob storage is accessible

**Cons:**
- Still requires Docker Hub to be partially functional
- Harder to read/maintain

### 2. 🆘 Alternative: Use AWS ECR Public Mirror (Fallback)
If Docker Hub continues to fail, use these alternative Dockerfiles that pull from AWS ECR Public (no authentication required).

**Files Created:**
- `frontend/Dockerfile.mirror` - Uses public.ecr.aws/docker/library/node
- `backend/Dockerfile.mirror` - Uses public.ecr.aws/docker/library/node

**To Use This Fallback:**

```bash
# Frontend
cp frontend/Dockerfile.mirror frontend/Dockerfile

# Backend  
cp backend/Dockerfile.mirror backend/Dockerfile

# Commit and push
git add frontend/Dockerfile backend/Dockerfile
git commit -m "Switch to AWS ECR Public mirror due to Docker Hub outage"
git push origin main
```

**Pros:**
- No authentication required
- AWS infrastructure is highly reliable
- Same official Node.js images, just mirrored

**Cons:**
- Requires manual file replacement
- May be slightly slower from some regions

### 3. 🔄 Other Options

#### Wait for Docker Hub Recovery
Check status at: https://status.docker.com/
- Outages typically last 15-60 minutes
- Usually the fastest solution if you can wait

#### Use GitHub Container Registry
```dockerfile
FROM ghcr.io/node-docker/node:20-alpine
```

#### Use Chainguard Images
```dockerfile
FROM cgr.dev/chainguard/node:latest
```

## Current Status

The repository currently uses **Solution #1 (Image Digests)**.

If deployment still fails, use **Solution #2 (ECR Public Mirror)** by copying the `.mirror` files.

## Monitoring

- Docker Hub Status: https://status.docker.com/
- AWS ECR Public: https://status.aws.amazon.com/ (us-east-1 region)

## Prevention for Future

To avoid this in the future, consider:

1. **Pre-pull Images**: Cache images in your CI/CD pipeline
2. **Use Private Registry**: Mirror images to your own registry
3. **Multi-Registry Strategy**: Have fallback registries configured
4. **Version Pinning**: Use specific versions/digests (already implemented)

## Quick Reference

```bash
# Check if Docker Hub is accessible
docker pull node:20-alpine

# Force use ECR mirror
docker pull public.ecr.aws/docker/library/node:20-alpine

# Test current Dockerfile
docker build -t test-build ./frontend
```
