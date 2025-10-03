# Security Policy

## Vulnerability Management

### Current Status
- **6 vulnerabilities detected** (5 high, 1 low) via GitHub Dependabot
- View details: https://github.com/simplehostingserverd/shennastudiollc/security/dependabot

### Mitigation Strategy

#### 1. Review Dependabot Alerts
Visit the GitHub security tab to see specific vulnerable packages and recommended fixes.

#### 2. Update Dependencies
Run these commands to update vulnerable packages:

```bash
# Backend
cd ocean-backend
npm update
npm audit fix
npm audit fix --force  # Only if safe fixes don't work

# Frontend
cd ..
npm update
npm audit fix
npm audit fix --force  # Only if safe fixes don't work
```

#### 3. Package Overrides (Already Implemented)
The project already includes security overrides in `package.json`:
- axios: ^1.7.7
- braces: ^3.0.3
- ws: ^8.18.0
- path-to-regexp: 0.1.10 (downgraded for Express compatibility)
- cross-spawn: ^7.0.6
- node-forge: ^1.3.1

#### 4. Regular Updates
- Enable Dependabot automated security updates in GitHub
- Review and merge Dependabot PRs regularly
- Run `npm audit` before each deployment

### Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Keep dependencies updated** - Review updates monthly
3. **Use security scanning** - Enable GitHub's security features
4. **Monitor logs** - Check for suspicious activity
5. **Limit access** - Use least privilege principle

### Reporting Security Issues
Email: security@shennastudio.com (or admin@shennastudio.com)

## Coolify Deployment Security

### Remove Unused Environment Variables
In Coolify, remove these unused Supabase variables:
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`

The application uses local PostgreSQL, not Supabase.

### Required Environment Variables Only
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `REDIS_URL`
- `JWT_SECRET`
- `COOKIE_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
