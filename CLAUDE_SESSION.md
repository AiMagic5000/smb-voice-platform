# SMB Voice Platform - Claude Session Context

**Last Updated:** 2026-01-16 02:40 UTC
**Project Status:** 92% Complete
**Current Issue:** Desktop app GitHub release workflow in progress

---

## Quick Recovery Guide

If Claude crashes and needs to resume, follow this checklist:

### 1. Check Current State
```bash
cd /mnt/c/Users/flowc/Documents/smb-voice-platform
git status
git log --oneline -3
```

### 2. Verify Production Status
```bash
# From server (recommended)
ssh admin1@10.28.28.30 "curl -s https://voice.startmybusiness.us/api/health"

# Get current container
ssh admin1@10.28.28.30 "docker ps --filter 'name=jwwcooo8k0co44c0s0gsw8kk' --format '{{.Names}} {{.Status}}'"
```

### 3. Continue Pending Tasks
- [x] Production deployment working
- [x] LLM/AI SEO (robots.txt, llms.txt)
- [ ] Desktop app GitHub release (builds succeed, release step needs fix)
- [ ] PWA testing on iOS Safari

---

## Project Overview

### Business Model
- **Product:** Business phone system with AI receptionist
- **Price:** $7.95/month (profit margin: $5/user)
- **Target:** Small businesses needing professional phone presence
- **Domain:** voice.startmybusiness.us (primary) / smbvoice.alwaysencrypted.com (backup)

### Tech Stack
- **Framework:** Next.js 16.1.2 with App Router
- **Auth:** Clerk (clerk.com)
- **Database:** Cognabase (self-hosted Supabase at smb-db.cognabase.com)
- **VoIP:** SignalWire
- **Payments:** Stripe
- **Hosting:** Coolify on Dell R730 server
- **CDN/Tunnel:** Cloudflare

### Key URLs
- **Production:** https://voice.startmybusiness.us
- **Backup:** https://smbvoice.alwaysencrypted.com
- **Coolify:** https://coolify.alwaysencrypted.com
- **Cognabase Studio:** https://smb-studio.cognabase.com
- **GitHub:** https://github.com/AiMagic5000/smb-voice-platform

---

## Current Session Progress (2026-01-16)

### Completed
1. **Downloads Component** - Updated with native desktop download links
   - Windows (.exe), macOS (.dmg), Linux (.AppImage)
   - Points to GitHub Releases

2. **Desktop App Build**
   - Fixed package.json metadata (author, homepage, maintainer)
   - Builds succeed locally for all platforms
   - Linux AppImage: 104MB, Deb: 73MB

3. **GitHub Actions Workflows**
   - Desktop app build workflow with release creation
   - iOS/Android builds changed to manual-only trigger

4. **LLM/AI SEO**
   - robots.txt with AI bot permissions (GPTBot, ClaudeBot, etc.)
   - llms.txt with service info and AI policy

5. **Production Deployment**
   - Site running at https://voice.startmybusiness.us
   - All health checks passing (Clerk, Database, SignalWire, Email)
   - Cloudflare tunnel configuration updated

### In Progress
- **GitHub Release** - Windows/Mac/Linux builds succeed but release step has minor issue

### Git Commits (Latest)
```
753f37b Fix GitHub release workflow to auto-create version tag
fb668e7 Add missing package.json metadata for Electron builds
0784c63 Fix desktop build and disable auto-trigger for mobile builds
d4e2a31 Update Electron app and GitHub Actions for releases
5fd6fae Add native desktop download links to Downloads component
```

---

## Deployment Configuration

### Coolify Details
- **Application UUID:** `jwwcooo8k0co44c0s0gsw8kk`
- **Current Container:** `jwwcooo8k0co44c0s0gsw8kk-023045120075`
- **Container IP:** `10.0.1.18`
- **Build Pack:** Dockerfile
- **Repository:** AiMagic5000/smb-voice-platform
- **Branch:** main

### Deployment Commands
```bash
# Trigger deployment via API
curl -s -X GET -H "Authorization: Bearer 4|1XflCpmREERP7N4yfscb7sSUVruXHSpzkddp7aBN0bbc79d2" \
  "https://coolify.alwaysencrypted.com/api/v1/deploy?uuid=jwwcooo8k0co44c0s0gsw8kk"

# After deployment, get new container IP and update tunnel:
NEW_IP=$(ssh admin1@10.28.28.30 "docker inspect \$(docker ps --filter 'name=jwwcooo8k0co44c0s0gsw8kk' -q) | jq -r '.[0].NetworkSettings.Networks.coolify.IPAddress'")
# Then update Cloudflare tunnel config with new IP
```

### Cloudflare Tunnel Update
After each deployment, update the tunnel config with the new container IP:
```bash
# Use IP-based routing (more stable than container name)
curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/82f3c6e0ba2e585cd0fe3492151de1a0/cfd_tunnel/d4b5f6f4-a09b-4c0b-9cbb-a80659ea775c/configurations" \
  -H "X-Auth-Email: Coreypearsonemail@gmail.com" \
  -H "X-Auth-Key: 922460400012ed8596f9188ad3a21aac2918e" \
  -H "Content-Type: application/json" \
  -d '{"config":{"ingress":[{"service":"http://NEW_IP:3000","hostname":"smbvoice.alwaysencrypted.com"},{"service":"http://NEW_IP:3000","hostname":"voice.startmybusiness.us"},...]}}'
```

---

## Health Check Status

Current health check response from production:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "smb-voice-platform",
  "environment": "production",
  "checks": {
    "clerk": true,
    "database": true,
    "signalwire": true,
    "email": true
  }
}
```

---

## Remaining Tasks

### High Priority
1. **GitHub Release Fix** - Release step needs to handle existing tags
2. **PWA Testing** - Test iOS Safari "Add to Home Screen"

### Medium Priority
3. **Admin Panel** - Complete user management functionality
4. **SignalWire Integration** - Phone number provisioning flow

### Low Priority
5. **Stripe Billing** - Webhook handlers for subscription events
6. **AI Receptionist** - OpenAI/Claude integration for call handling
7. **Documentation** - User guides and API documentation

---

## File Structure (Key Files)

```
smb-voice-platform/
├── src/
│   ├── app/
│   │   ├── (marketing)/       # Public pages
│   │   ├── (dashboard)/       # Dashboard pages
│   │   ├── (admin)/           # Admin panel
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── marketing/
│   │   │   └── downloads.tsx  # Desktop app downloads
│   │   ├── dashboard/
│   │   └── seo/
│   │       └── json-ld.tsx    # Schema.org structured data
│   └── lib/
│       └── db/schema.ts       # Database schema
├── public/
│   ├── robots.txt             # AI bot permissions
│   ├── llms.txt               # LLM service info
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icons/                 # App icons
├── desktop-app/               # Electron app
│   ├── main.js                # Loads voice.startmybusiness.us
│   ├── package.json           # Build config
│   └── dist/                  # Built apps
├── .github/workflows/
│   ├── electron-build.yml     # Desktop app CI/CD
│   ├── ios-build.yml          # iOS (manual trigger)
│   └── android-build.yml      # Android (manual trigger)
└── Dockerfile
```

---

## DO NOT Use

- **Ralph Loop** - Caused infinite loop crashes
- **git push --force** - Unless absolutely necessary
- **Large files in git** - Use .gitignore for >100MB files
- **Auto-trigger mobile builds** - Changed to manual only

---

## Session Notes

### 2026-01-16 Progress Checkpoint

**Accomplished:**
- Fixed Downloads component with native desktop app links
- Updated Electron app to load production URL
- Created GitHub Actions workflow for desktop releases
- Fixed Electron build errors (package.json metadata)
- Deployed latest code to production
- All health checks passing
- Cloudflare tunnel properly configured

**Current State:**
- Production is live and healthy
- Desktop builds succeed on GitHub Actions
- Release creation has minor issue (need to handle existing tags)
- PWA configured with service worker and manifest

**Next Steps:**
1. Fix GitHub release workflow or create release manually
2. Test PWA installation on iOS
3. Complete admin panel testing
