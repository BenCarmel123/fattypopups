# FattyPopups

A full-stack culinary event platform that promotes local pop-up events and independent chefs through AI-assisted content generation and automated management.

Designed as a production learning sandbox for end-to-end product ownership.

---

## Project Structure

```
fattypopups/
├── backend/                 # Express.js API server
│   ├── routes/             # API endpoints (events, auth, draft)
│   ├── services/           # Business logic
│   │   ├── database/       # Supabase/PostgreSQL operations
│   │   ├── agent/          # AI agent service
│   │   ├── s3/             # AWS S3 file uploads
│   │   └── embeddings/     # OpenAI embeddings
│   ├── config/             # Clients & middleware
│   └── server.js           # Entry point
│
├── frontend/               # React application
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
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development with hot reload
└── CLAUDE.md               # Developer guidelines
```

## Key Features

- **AI-Generated Descriptions** - OpenAI API (English/Hebrew) at `backend/services/agent/`
- **Vector Search** - pgvector embeddings for semantic search at `backend/services/embeddings/`
- **Admin Dashboard** - Modular form with validation & draft saving at `frontend/src/pages/admin/`
- **File Upload System** - Direct S3 uploads at `backend/services/s3/`
- **Automated Cleanup** - Lambda removes events older than 2 days & cleans temp S3 files, runs daily via EventBridge at `lambdas/cleanup/`

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

- **Frontend** - React 19, Chakra UI, Tailwind CSS 4, React Router, Axios
- **Backend** - Node.js 18, Express.js, Nodemon
- **Database** - Supabase / PostgreSQL with pgvector
- **AI** - OpenAI API (embeddings + descriptions)
- **Cloud** - AWS S3, Lambda, EventBridge
- **Auth** - JWT tokens
- **Containerization** - Docker & Docker Compose
