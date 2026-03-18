# FattyPopups

A full-stack culinary event platform that promotes local pop-up events and independent chefs through AI-assisted content generation and automated management.

Designed as a production learning sandbox for end-to-end product ownership.

---

## Project Structure

```
fattypopups/
├── backend/            
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic layers
│   │   ├── agent/          # AI draft generation 
│   │   ├── cache/          
│   │   ├── embeddings/     # pgvector embeddings (generate, search, store)
│   │   ├── entities/       # CRUD operations (chef, venue, event, linking)
│   │   ├── orchestrator/   # Event creation/update coordination
│   │   └── s3/             
│   ├── config/
│   ├── utils/
│   ├── tests/              # Unit tests (mirrors services/ structure)
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── server.js           # Entry point
│
├── frontend/             
│   ├── src/
│   │   ├── pages/          # Main page components
│   │   │   ├── home/       # Public event listing
│   │   │   └── admin/      # Dashboard, EventForm, Login
│   │   ├── components/     # Reusable UI components
│   │   └── utils/          # Helper functions
│   └── public/             # Static assets
│
├── lambdas/                # AWS Lambda functions
│   └── cleanup/            # Scheduled cleanup (2-day retention)
│
├── docker/                 # Docker Compose configuration
│   └── docker-compose.yml  # Development with hot reload
└── CLAUDE.md               # Developer guidelines
```

## API Endpoints

> Routes marked 🔒 require a valid JWT in the `Authorization: Bearer <token>` header.

### Events
- `GET /api/events` - List published events
- `GET /api/events/drafts` - List all events including drafts 🔒
- `POST /api/events` - Create new event 🔒
- `PUT /api/events/:id` - Update event 🔒
- `DELETE /api/events` - Delete events by title 🔒

### Authentication
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Google OAuth callback, issues JWT
- `GET /auth/check` - Verify JWT validity

### Drafts
- `POST /agent` - Generate AI draft from prompt 🔒

## Tech Stack

- **Cloud** - AWS EC2, Amplify, S3, Lambda, EventBridge
- **Backend** - Node.js 18, Express.js, PM2
- **Database** - PostgreSQL (Supabase) with pgvector
- **Cache** - Redis via Upstash (prod) / Docker (dev)
- **LLM** - OpenAI
- **Auth** - JWT + Google OAuth
- **Frontend** - React 19, Chakra UI
- **Dev** - Docker Compose, Claude Code 

## External APIs
- **OpenAI** - Text generation & vector embeddings
- **AWS S3** - Image storage & retrieval
- **Supabase** - PostgreSQL client & RPC (pgvector search)
- **Google OAuth** - Admin authentication
- **Google Places** - Venue location enrichment
- **Google Translate** - English → Hebrew description translation
