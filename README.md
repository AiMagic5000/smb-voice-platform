# SMB Voice Platform

Professional business phone system for small businesses. Simple, affordable, and powered by AI.

**$7.95/month** - No contracts, no hidden fees.

## Features

- **Business Phone Number** - Local or toll-free numbers
- **AI Receptionist** - 24/7 automated call handling
- **Mobile Apps** - iOS, Android, and desktop
- **Voicemail to Email** - Transcribed voicemails delivered to your inbox
- **Call Recording** - Keep records of important calls
- **Team Extensions** - Up to 5 team members included
- **24/7 Support** - Real humans, always available

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Clerk.com (multi-tenant)
- **Database**: Cognabase (self-hosted Supabase) + Drizzle ORM
- **VoIP**: SignalWire + FusionPBX
- **Email**: React Email + Resend
- **Deployment**: Docker on Coolify

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Clerk.com account
- SignalWire account
- Cognabase/Supabase instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd smb-voice-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   - Clerk publishable and secret keys
   - Database connection string
   - SignalWire credentials
   - SMTP settings

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```bash
docker build -t smb-voice .
docker run -p 3000:3000 --env-file .env.local smb-voice
```

Or with Docker Compose:

```bash
docker-compose up -d
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API routes
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── marketing/         # Marketing page components
│   ├── shared/            # Shared components
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── db/                # Database schema and client
│   └── email/             # Email templates
└── types/                 # TypeScript types
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `DATABASE_URL` | PostgreSQL connection string |
| `SIGNALWIRE_PROJECT_ID` | SignalWire project ID |
| `SIGNALWIRE_API_TOKEN` | SignalWire API token |
| `SIGNALWIRE_SPACE_URL` | SignalWire space URL |
| `RESEND_API_KEY` | Resend API key for emails |
| `OPENAI_API_KEY` | OpenAI API key for AI features |

See `.env.example` for all variables.

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/phone-numbers` | GET/POST | Manage phone numbers |
| `/api/extensions` | GET/POST | Manage extensions |
| `/api/webhooks/signalwire` | POST | SignalWire webhooks |
| `/api/webhooks/clerk` | POST | Clerk webhooks |

## Deployment to Coolify

1. Create a new service in Coolify
2. Connect your Git repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Configure domain and SSL

## Pricing

**SMB Voice Basic** - $7.95/month

Includes:
- Business phone number
- AI receptionist (24/7)
- 5 team extensions
- Voicemail to email
- Call forwarding
- Mobile & desktop apps
- 500 minutes included
- Call recording
- 24/7 support

## Support

- **Phone**: 888-534-4145 (24/7)
- **Email**: support@startmybusiness.us
- **Website**: https://voice.startmybusiness.us

## License

Copyright 2026 Start My Business Inc. All rights reserved.
