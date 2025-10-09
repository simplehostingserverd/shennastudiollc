# Create Admin User in Serene-Presence

## Admin Credentials

```
Email: admin@shennastudio.com
Password: ShennaStudio2024!Admin
```

## Commands to Run

### Step 1: Switch to Serene-Presence Project

```bash
cd /Users/softwareprosorg/Documents/NewShenna/shennastudiollc

# Create Railway config for serene-presence
cat > .railway.json << 'EOF'
{
  "projectId": "46b0dc40-0105-4944-add1-9e6844c2996e",
  "environmentId": "02b4bab6-3ce8-45cc-af17-0b02773e3156",
  "serviceId": "decd79a0-b695-490f-a12f-e5092057c167"
}
EOF
```

### Step 2: Verify You're Connected to Serene-Presence

```bash
railway status
```

Should show:
- Project: serene-presence
- Environment: production
- Service: Backend

### Step 3: Create Admin User

```bash
railway run npx medusa user -e admin@shennastudio.com -p ShennaStudio2024!Admin
```

OR use the Medusa CLI directly:

```bash
railway run npx medusa user --email admin@shennastudio.com --password ShennaStudio2024!Admin
```

### Alternative: Use Environment Variables (Auto-Create on Deploy)

```bash
railway variables --set "MEDUSA_ADMIN_EMAIL=admin@shennastudio.com"
railway variables --set "MEDUSA_ADMIN_PASSWORD=ShennaStudio2024!Admin"
railway variables --set "AUTO_CREATE_ADMIN=true"

# Redeploy to create user
railway up
```

### Step 4: Login to Admin Panel

Once the user is created, login at:

**URL**: https://[your-serene-backend-domain]/app

**Credentials**:
- Email: `admin@shennastudio.com`
- Password: `ShennaStudio2024!Admin`

## Switch Back to Poetic-Mindfulness

When done, switch back to your other project:

```bash
cd /Users/softwareprosorg/Documents/NewShenna/shennastudiollc

# Re-link to poetic-mindfulness
rm .railway.json
railway link  # Select poetic-mindfulness
```

OR manually create poetic-mindfulness config:

```bash
cat > .railway.json << 'EOF'
{
  "projectId": "4b26eb93-239c-4be6-8387-3912e263f5af",
  "environmentId": "9bc9ea50-8494-4abd-875a-fd933470eb3d",
  "serviceId": "2e6ba6d2-7cf4-40d6-bab8-f1e697212845"
}
EOF
```
