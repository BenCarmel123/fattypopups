# FattyPopups

A full-stack culinary event platform that promotes local pop-up events and independent chefs through AI-assisted content generation and automated management.

Designed as a production learning sandbox for end-to-end product ownership.

---

## Architecture

![](architecture.png)

---

## Project Structure

```
fattypopups/
├── backend/
│   ├── routes/             # API endpoint definitions 
│   ├── controllers/        # Request/response handlers per resource
│   ├── services/           # Business logic layers
│   │   ├── draft/          # AI draft generation pipeline
│   │   │   ├── generate/
│   │   │   │   ├── vision/ # OpenAI call with image input (text extraction, crop coordinates)
│   │   │   │   └── text/   # OpenAI call with text input (draft generation, similarity search)
│   │   │   ├── image/      # Image processing: crop, upload
│   │   │   └── enrich/     # Entity enrichment
│   │   ├── cache/
│   │   ├── embeddings/     # pgvector embeddings (generate, search, store)
│   │   ├── entities/       # CRUD operations (chef, venue, event, linking)
│   │   ├── orchestrator/   # Event creation/update coordination
│   │   ├── queue/          # SQS message publishing
│   │   └── s3/
│   ├── worker/             # Background consumers (SQS draft processing)
│   ├── config/
│   ├── utils/
│   ├── tests/              # Unit tests 
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── server.js           # Entry point
│
├── frontend/             
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home/             # Public event listing
│   │   │   │   ├── components/
│   │   │   │   │   ├── card/     # Event card (display, flip, body, footer)
│   │   │   │   │   └── header/   # Header, Logo, HomeBanner, WhatsApp button
│   │   │   │   └── context/      # React contexts (EventIndex)
│   │   │   ├── admin/            # Dashboard, EventForm, DraftBuilder, Login
│   │   │   │   ├── components/   # Admin-specific UI (alerts, spinners, file upload)
│   │   │   │   │   ├── draft/    # Draft-specific (Toggle, ProcessingBar)
│   │   │   │   │   └── form/     # Form fields, structure, typeahead
│   │   │   │   ├── views/        # Page-level views
│   │   │   │   └── utils/        # Admin validation & form parsing
│   │   │   └── about/            # About page
│   │   ├── components/buttons/   # Shared buttons (AdminButton, navigation)
│   │   ├── config/               # Theme, colors, icons, strings
│   │   ├── controller/           # API client layer
│   │   └── utils/                # Shared helpers (auth, formatting, links)
│   └── public/                   # Static assets
│
├── lambdas/                # AWS Lambda functions
│   ├── cleanup/            # Scheduled cleanup (1-day retention)
│   └── verify-embeddings/  # Verifies all published events have embeddings, regenerates missing ones
│
└── docker-compose.yml      # Docker Compose configuration (local only)
```

## API Endpoints

> Routes marked 🔒 require a valid JWT in the `Authorization: Bearer <token>` header.

### Events
- `GET /api/events` - List published events
- `GET /api/events/drafts` - List all events including drafts 🔒
- `POST /api/events` - Create new event 🔒
- `PUT /api/events/:id` - Update event 🔒
- `DELETE /api/events/:id` - Delete event by ID 🔒

### Authentication
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Google OAuth callback, issues JWT
- `GET /auth/check` - Verify JWT validity

### Drafts
- `POST /agent/draft` - Generate AI draft from prompt 🔒

### Health
- `GET /health` - Server and DB connectivity check (rate limited)

## Testing

**Framework:** Vitest — run with `npm test` from `backend/`

Tests live in `backend/tests/` mirroring the `services/` structure:

| Area | Files |
|---|---|
| Routes | auth, chefs, draft, events, venues |
| Draft | orchestrateDraft, googleMaps |
| Cache | invalidation |
| Embeddings | generate, search, storage |
| Entities | chef, event, venue, linking, parse |
| Orchestrator | computeState |
| S3 | upload, draftUpload, utils |
| Utils | isTrue, timestamp |

Each file contains one focused test (1 `describe`, 1 `it`).

## CI/CD Pipeline

**Rate limiting** applied to `GET /api/events` and `GET /health` via `express-rate-limit`.

**CI** (on PR to `main`): API route checks, npm audit, unit tests (all block merge), ESLint (non-blocking)

**CD** (on push to `main`): SSH into EC2, reset, pull, install, restart PM2

## Tech Stack

- **Cloud** - AWS EC2, S3, SQS, Lambda, EventBridge, Amplify
- **Backend** - Node.js 20, Express.js, PM2
- **Database** - PostgreSQL (Supabase) with pgvector
- **Cache** - Redis via Upstash (prod) / Docker (dev)
- **AI** - OpenAI (vision + text + translation), Sharp (image processing)
- **Auth** - JWT + Google OAuth
- **Frontend** - React 19, Vite, Chakra UI
- **Validation** - Zod (schema validation)
- **Testing** - Vitest (ESM-native unit tests)
- **Dev** - Docker Compose, Claude Code

## AI Tooling (Claude Code)

**Rules** (`.claude/rules/`): `unit-test.md`, `hld.md`

**Commands** (`.claude/commands/`): `/clean-branches`, `/pre-commit`, `/review-project`, `/thumb-rules`, `/sync-backend-env`

## External APIs
- **OpenAI** - Vision analysis, text generation, Hebrew translation & vector embeddings
- **AWS S3** - Image storage & retrieval
- **Supabase** - PostgreSQL client & RPC (pgvector search)
- **Google OAuth** - Admin authentication
- **Google Places** - Venue location enrichment
- **SerpApi** - Google Search API for Instagram handle discovery during entity enrichment
