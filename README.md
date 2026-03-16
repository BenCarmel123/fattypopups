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

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create new event (requires auth)
- `PUT /api/events/:id` - Update event (requires auth)
- `DELETE /api/events/:id` - Delete event (requires auth)

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration

### Drafts
- `POST /api/draft/generate` - Generate AI description

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
