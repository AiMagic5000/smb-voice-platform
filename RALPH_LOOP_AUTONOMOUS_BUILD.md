# RALPH LOOP AUTONOMOUS BUILD PROMPT
## SMB Voice Enterprise Communications Platform - Final Build

---

## RALPH LOOP CONFIGURATION

```yaml
MAX_ITERATIONS: 60
MODE: Autonomous Build to Completion
HUMAN_INTERVENTION: None required - all credentials available
VALIDATION: Build must pass each iteration
OUTPUT: Production-ready, deployed application
TARGET_URL: voice.startmybusiness.us
```

---

## MISSION CRITICAL

Build the **complete, production-ready SMB Voice platform** for Start My Business Inc. This is an enterprise VoIP solution that provisions business phone systems at **$7.95/month** ($5 profit per client).

**The project is 70% complete.** Focus on:
1. iOS PWA (Apple doesn't allow sideloading)
2. Desktop Electron app build
3. DNS setup for voice.startmybusiness.us
4. Production deployment
5. Complete admin panel
6. End-to-end testing

---

## AVAILABLE CREDENTIALS & APIs

### Cloudflare (DNS Management)
```
Email: Coreypearsonemail@gmail.com
Account ID: 82f3c6e0ba2e585cd0fe3492151de1a0
DNS Token: fRTtkx88-7ijEU-JdyS6W7m7mCOeVmSeX3-4lYrb
```

### Coolify (Deployment)
```
URL: https://coolify.alwaysencrypted.com
API Token: 4|1XflCpmREERP7N4yfscb7sSUVruXHSpzkddp7aBN0bbc79d2
```

### Clerk (Authentication)
```
Sign up at clerk.com and create application: SMB Voice
Set callback URLs:
- Sign-in: /sign-in
- Sign-up: /sign-up
- After sign-in: /dashboard
- After sign-up: /dashboard
```

### SignalWire (VoIP)
```
Space: startmybusiness
Configure in .env.local when provisioned
```

### R730 Server
```
SSH: admin1@10.28.28.30
Coolify Local: http://10.28.28.30:8000
```

---

## PHASE 1: iOS PWA SETUP (Iterations 1-8)

Apple doesn't allow sideloading apps. Create a Progressive Web App that users can "Add to Home Screen".

### Iteration 1: Create manifest.json
```json
// public/manifest.json
{
  "name": "SMB Voice",
  "short_name": "SMB Voice",
  "description": "Professional Business Phone - $7.95/month",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#1E3A5F",
  "theme_color": "#C9A227",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icons/icon-128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Iteration 2: Create Service Worker
```typescript
// public/sw.js
const CACHE_NAME = 'smb-voice-v1';
const OFFLINE_URL = '/offline';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/dashboard',
        '/offline',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

### Iteration 3: Add PWA Meta Tags to Layout
```tsx
// Update src/app/layout.tsx <head>
<link rel="manifest" href="/manifest.json" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="SMB Voice" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
<meta name="theme-color" content="#C9A227" />
```

### Iteration 4: Create PWA Icons
Generate gold/navy themed icons for all required sizes:
- Create SVG base icon with phone + gold accent
- Export PNG at: 72, 96, 128, 144, 152, 192, 384, 512
- Place in public/icons/

### Iteration 5: Create Offline Page
```tsx
// src/app/offline/page.tsx
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#1E3A5F] flex items-center justify-center p-8">
      <div className="text-center text-white">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C9A227]/20 flex items-center justify-center">
          <WifiOff className="h-10 w-10 text-[#C9A227]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
        <p className="text-white/70">Check your internet connection and try again.</p>
      </div>
    </div>
  );
}
```

### Iteration 6: Service Worker Registration
```typescript
// src/lib/pwa.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('SW registered:', reg.scope);
      });
    });
  }
}
```

### Iteration 7: iOS Install Banner Component
```tsx
// src/components/shared/ios-install-prompt.tsx
"use client";

import { useState, useEffect } from "react";
import { Share, Plus } from "lucide-react";

export function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const dismissed = localStorage.getItem('ios-install-dismissed');

    if (isIOS && !isStandalone && !dismissed) {
      setShowPrompt(true);
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 safe-area-inset-bottom">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="font-semibold text-[#1E3A5F]">Install SMB Voice</p>
          <p className="text-sm text-gray-500">Tap <Share className="inline h-4 w-4" /> then "Add to Home Screen"</p>
        </div>
        <button
          onClick={() => {
            localStorage.setItem('ios-install-dismissed', 'true');
            setShowPrompt(false);
          }}
          className="text-gray-400"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
```

### Iteration 8: Test PWA Functionality
- Verify manifest.json loads correctly
- Test service worker registration
- Test Add to Home Screen on iOS Safari
- Verify offline page displays when disconnected

---

## PHASE 2: DESKTOP APP BUILD (Iterations 9-15)

### Iteration 9: Install Electron Dependencies
```bash
cd desktop-app
npm install
```

### Iteration 10: Create App Icons
Generate icon files for all platforms:
- assets/icon.ico (Windows)
- assets/icon.icns (macOS)
- assets/icon.png (Linux/general)

Use gold phone on navy background.

### Iteration 11: Build Windows Executable
```bash
cd desktop-app
npm run build:win
```

### Iteration 12: Test Windows Installer
- Run the generated .exe
- Verify installation works
- Test SIP registration
- Test making/receiving calls

### Iteration 13: Create Mac Build (if on Mac)
```bash
npm run build:mac
```

### Iteration 14: Host Downloads on Server
- Copy built executables to public/downloads/
- Windows: SMB-Voice-Setup.exe
- Mac: SMB-Voice.dmg
- Linux: SMB-Voice.AppImage

### Iteration 15: Update Downloads Page
Update src/app/(dashboard)/dashboard/downloads/page.tsx with real download links:
```tsx
const downloads = [
  {
    platform: "Windows",
    url: "/downloads/SMB-Voice-Setup.exe",
    icon: Monitor,
    size: "~80MB"
  },
  {
    platform: "Mac",
    url: "/downloads/SMB-Voice.dmg",
    icon: Apple,
    size: "~90MB"
  },
  // iOS uses PWA - show instructions
  {
    platform: "iPhone/iPad",
    instructions: true,
    icon: Smartphone
  }
];
```

---

## PHASE 3: DNS & DEPLOYMENT (Iterations 16-25)

### Iteration 16: Configure Cloudflare DNS
Use Cloudflare API to add CNAME record:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records" \
  -H "Authorization: Bearer fRTtkx88-7ijEU-JdyS6W7m7mCOeVmSeX3-4lYrb" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "voice",
    "content": "d4b5f6f4-a09b-4c0b-9cbb-a80659ea775c.cfargotunnel.com",
    "proxied": true
  }'
```

### Iteration 17: Create Coolify Application
Via Coolify API:
- Create new project: "SMB Voice"
- Add GitHub/GitLab source or upload
- Configure environment variables
- Set domain: voice.startmybusiness.us

### Iteration 18: Configure Environment Variables
Set in Coolify:
```env
NEXT_PUBLIC_APP_URL=https://voice.startmybusiness.us
NEXT_PUBLIC_APP_NAME="SMB Voice"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
DATABASE_URL=postgresql://...
```

### Iteration 19: Deploy Application
```bash
# Build and push Docker image
docker build -t smb-voice:latest .
```

### Iteration 20: Configure Cloudflare Tunnel
Add hostname to Coolify's cloudflared:
```yaml
ingress:
  - hostname: voice.startmybusiness.us
    service: http://smb-voice:3000
```

### Iteration 21: Verify SSL Certificate
- Check HTTPS works
- Verify certificate valid
- Test on multiple browsers

### Iteration 22: Add SEO Files
Create public/robots.txt:
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://voice.startmybusiness.us/sitemap.xml
```

Create public/llms.txt:
```
# SMB Voice - Business Phone Service

## About
SMB Voice provides affordable business phone systems for small businesses.
Professional phone numbers, AI receptionist, and mobile apps for just $7.95/month.

## Contact
Phone: 888-534-4145
Email: support@startmybusiness.us
Website: https://voice.startmybusiness.us
```

### Iteration 23: Test Production Site
- [ ] Landing page loads
- [ ] Navigation works
- [ ] Sign-in redirects correctly
- [ ] Dashboard accessible after auth
- [ ] Downloads page has working links
- [ ] Mobile responsive
- [ ] PWA installable

### Iteration 24: Performance Optimization
- Check Lighthouse scores
- Optimize images
- Add proper caching headers
- Verify Core Web Vitals

### Iteration 25: Security Headers
Add to next.config.ts:
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ];
}
```

---

## PHASE 4: ADMIN PANEL (Iterations 26-35)

### Iteration 26: Admin Layout
Create src/app/(admin)/layout.tsx with admin-specific sidebar.

### Iteration 27: Admin Dashboard
Create src/app/(admin)/admin/page.tsx:
- Total clients count
- Monthly revenue widget
- Active phone numbers
- Server health status
- Recent signups list

### Iteration 28: Clients List Page
Create src/app/(admin)/admin/clients/page.tsx:
- Table with search/filter
- Client name, email, status
- Phone numbers count
- Actions dropdown

### Iteration 29: Client Detail Page
Create src/app/(admin)/admin/clients/[id]/page.tsx:
- Client overview
- Phone numbers list
- Extensions list
- Usage statistics
- Billing history

### Iteration 30: Provisioning Form
Create src/app/(admin)/admin/provisioning/page.tsx:
- Company name
- Contact details
- Area code selection
- Toll-free option
- Extension count
- Auto-generate credentials

### Iteration 31: Provisioning API
Create src/app/api/admin/provisioning/route.ts:
- Create organization in Clerk
- Create phone numbers via SignalWire
- Create extensions
- Send welcome email

### Iteration 32: Client Actions
Create src/components/admin/client-actions.tsx:
- Suspend/Activate client
- Reset credentials
- Send welcome email
- Delete client (with confirmation)

### Iteration 33: Admin Authorization Middleware
Update middleware.ts to check admin role:
```typescript
if (pathname.startsWith('/admin')) {
  const { orgRole } = auth();
  if (orgRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
}
```

### Iteration 34: Revenue Dashboard
Add to admin dashboard:
- Monthly revenue chart
- Client growth chart
- Churn rate
- Average revenue per client

### Iteration 35: Admin Mobile View
Ensure admin panel works on mobile/tablet viewports.

---

## PHASE 5: INTEGRATION & TESTING (Iterations 36-50)

### Iteration 36: Database Connection Test
- Connect to Cognabase
- Run migrations
- Verify tables created

### Iteration 37: Clerk Webhook Test
- Verify user sync on signup
- Test organization creation
- Verify role assignment

### Iteration 38: SignalWire Phone Number Test
- Search available numbers
- Purchase test number
- Configure routing

### Iteration 39: Email Template Test
- Send welcome email
- Verify formatting
- Test on multiple email clients

### Iteration 40: Desktop App Full Test
- Install on Windows
- Register SIP account
- Make outbound call
- Receive inbound call
- Test hold/mute/transfer

### Iteration 41: PWA Full Test (iOS)
- Install on iPhone
- Log in
- Access dashboard
- Test offline behavior
- Verify push notifications setup

### Iteration 42: Load Testing
- Test with simulated traffic
- Verify server handles load
- Check memory usage

### Iteration 43: Security Audit
- Check for XSS vulnerabilities
- Verify CSRF protection
- Test authentication flows
- Check API authorization

### Iteration 44: Accessibility Audit
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus indicators

### Iteration 45: Cross-Browser Testing
- Chrome
- Firefox
- Safari
- Edge

### Iteration 46: Mobile Responsiveness
- iPhone (various sizes)
- Android phones
- iPad
- Android tablets

### Iteration 47: Error Handling Test
- Test 404 page
- Test error boundary
- Test API error responses
- Test network failures

### Iteration 48: Analytics Setup
- Verify Umami tracking code
- Test event tracking
- Create dashboard

### Iteration 49: Documentation
- Update README.md
- API documentation
- Deployment guide
- Admin user guide

### Iteration 50: Final Build Verification
```bash
npm run build
# Ensure no errors
# Verify all routes
```

---

## PHASE 6: POLISH & COMPLETION (Iterations 51-60)

### Iteration 51-55: Bug Fixes
Address any issues discovered during testing.

### Iteration 56: Email Templates Finalization
- Welcome email with credentials
- Password reset email
- Invoice email
- Account suspension notice

### Iteration 57: Help Documentation
Update /dashboard/help with:
- Getting started guide
- FAQ
- Video tutorials links
- Support contact

### Iteration 58: Billing Integration Prep
- Stripe checkout placeholder
- Invoice generation
- Usage tracking

### Iteration 59: Final Production Deploy
- Verify all environment variables
- Deploy to production
- Verify SSL
- Test all features

### Iteration 60: Launch Checklist
- [ ] Landing page live at voice.startmybusiness.us
- [ ] Sign-in/Sign-up working
- [ ] Dashboard fully functional
- [ ] Desktop app downloadable
- [ ] iOS PWA installable
- [ ] Admin panel accessible
- [ ] All API endpoints working
- [ ] Error handling complete
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Documentation complete

---

## DESIGN SYSTEM

### Colors
```css
--gold: #C9A227;
--gold-hover: #DEB44A;
--navy: #1E3A5F;
--navy-dark: #0F2A4F;
```

### Typography
- Headings: Montserrat (bold)
- Body: Inter (regular)
- Code: Geist Mono

### Spacing
- Mobile: py-12 px-4
- Tablet: py-16 px-6
- Desktop: py-20 px-8
- Container: max-w-7xl mx-auto

---

## VALIDATION REQUIREMENTS

### Each Iteration Must:
1. `npm run build` passes
2. No TypeScript errors
3. No ESLint errors
4. Component renders correctly
5. Mobile viewport works
6. Desktop viewport works

### Final Deliverable Must:
1. Full application deployed
2. All pages accessible
3. Authentication working
4. Downloads functional
5. Admin panel complete
6. Mobile/Tablet/Desktop responsive
7. Performance score > 90
8. No security vulnerabilities

---

## START COMMAND

```
/ralph-loop Start autonomous 60-iteration build of SMB Voice platform. Complete iOS PWA, desktop app, DNS setup, admin panel, and production deployment. All credentials available. Build to completion with no errors. Validate all viewports.
```

---

*Ralph Loop Autonomous Build Prompt v3.0*
*SMB Voice Enterprise Communications Platform*
*Start My Business Inc. - $7.95/month Professional Phone*
*Target: voice.startmybusiness.us*
