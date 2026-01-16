# SMB Voice Platform Deployment Guide

## Overview
SMB Voice is deployed on the R730 server via Coolify with Cloudflare tunnel for SSL/routing.

## Current Deployment
- **URL**: https://smbvoice.alwaysencrypted.com
- **Server**: 10.28.28.30 (R730)
- **Container Platform**: Coolify
- **SSL**: Cloudflare tunnel

## DNS Setup for voice.startmybusiness.us

### Step 1: Cloudflare DNS Configuration
Add the following DNS record in Cloudflare for startmybusiness.us:

```
Type: CNAME
Name: voice
Target: d4b5f6f4-a09b-4c0b-9cbb-a80659ea775c.cfargotunnel.com
Proxy: ON (Orange cloud)
```

### Step 2: Cloudflare Tunnel Configuration
Add the domain to the tunnel configuration:

```bash
ssh admin1@10.28.28.30

# Edit cloudflared config
sudo nano /etc/cloudflared/config.yml

# Add ingress rule:
#   - hostname: voice.startmybusiness.us
#     service: http://localhost:3000

# Restart cloudflared
docker restart cloudflared
```

### Step 3: Update Coolify Deployment
In Coolify dashboard (https://coolify.alwaysencrypted.com):
1. Go to SMB Voice application
2. Add domain: voice.startmybusiness.us
3. Redeploy

## Environment Variables
Required variables for production (set in Coolify):

```env
# App
NEXT_PUBLIC_APP_URL=https://voice.startmybusiness.us
NODE_ENV=production

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database (Cognabase)
DATABASE_URL=postgresql://...

# SignalWire VoIP
SIGNALWIRE_PROJECT_ID=...
SIGNALWIRE_API_TOKEN=...
SIGNALWIRE_SPACE_URL=...

# Gumroad ($7.95/month billing)
GUMROAD_ACCESS_TOKEN=...
GUMROAD_SELLER_ID=...

# Email (Resend)
RESEND_API_KEY=re_...

# OpenAI (AI Receptionist)
OPENAI_API_KEY=sk-...
```

## Gumroad Webhook Setup
After deployment, configure Gumroad webhook (primary payment processor):

1. Go to Gumroad Settings → Advanced → Ping
2. Add endpoint: `https://voice.startmybusiness.us/api/webhooks/gumroad`
3. Events handled:
   - `sale` - New subscription purchase
   - `refund` - Refund processed
   - `cancellation` - Subscription cancelled
   - `subscription_updated` - Plan changed
   - `subscription_ended` - Subscription expired
   - `subscription_restarted` - Subscription reactivated

### Gumroad Product IDs
| Product | Permalink | Price |
|---------|-----------|-------|
| Starter | izcdvd | $7.95/month |
| Professional | ojjjt | $19.95/month |
| Enterprise | ouowmw | $49.95/month |

## SignalWire Webhook Setup
Configure SignalWire for incoming calls:

1. Go to SignalWire Dashboard → Phone Numbers
2. Set Voice URL: `https://voice.startmybusiness.us/api/signalwire/voice`
3. Set SMS URL: `https://voice.startmybusiness.us/api/signalwire/sms`

## Health Check
Verify deployment:

```bash
# Check app health
curl -s https://voice.startmybusiness.us/api/health

# Check from server
ssh admin1@10.28.28.30 "docker logs smb-voice --tail 50"
```

## Pricing
- **Monthly**: $7.95/month
- **Includes**: 1 phone number, 5 extensions, 500 AI minutes, unlimited US/Canada calls
- **Trial**: 14 days free

## Support
- Email: support@startmybusiness.us
- Phone: 888-534-4145
