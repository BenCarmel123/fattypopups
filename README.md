# FattyPopups

A full-stack culinary event platform that promotes local pop-up events and independent chefs through AI-assisted content generation and automated management.

Built with Node.js, React, PostgreSQL, and AWS - designed as a production learning sandbox for end-to-end product ownership.

---

## Features

- **AI-Generated Event Content** - Bilingual (English/Hebrew) event descriptions via OpenAI API
- **Dynamic Image Uploads** - AWS S3 integration for event posters and chef profiles
- **Admin Dashboard** - Complete event management with modular form components
- **Vector Search** - Semantic search and recommendations using PostgreSQL pgvector
- **Automated Cleanup** - AWS Lambda function removes events older than 14 days
- **Dockerized Setup** - Separate dev and production environments with Docker Compose

---

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| Frontend | React 19, Chakra UI, Tailwind CSS 4, React Router, Axios |
| Backend | Node.js 18, Express.js, Nodemon |
| Database | Supabase / PostgreSQL with pgvector |
| AI Integration | OpenAI API (embeddings + descriptions) |
| Cloud Services | AWS S3, AWS Lambda, EventBridge |
| Authentication | JWT tokens |
| Containerization | Docker & Docker Compose |

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
│   └── deletePastEvents/   # Scheduled cleanup (14-day retention)
│
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development with hot reload
└── CLAUDE.md               # Developer guidelines
```

---

## Local Development

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development without Docker)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/BenCarmel123/fattypopups.git
cd fattypopups
```

### 2. Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

**backend/.env.development:**
```env
PORT=5001
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket_name
JWT_SECRET=your_jwt_secret
```

**frontend/.env.development:**
```env
REACT_APP_API_URL=http://localhost:5001
```

### 3. Run with Docker (Recommended)

**Development mode (with hot reload):**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Production mode:**
```bash
docker-compose up --build
```

**Services:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

### 4. Run Locally (Without Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## AWS Lambda Functions

### deletePastEvents

**Purpose:** Automatically removes events older than 14 days from the database

**Trigger:** EventBridge schedule rule (runs daily)

**Location:** `lambdas/deletePastEvents/`

**Deployment:** Independent Lambda function connected to Supabase

---

## Key Features Explained

### AI-Generated Descriptions
- Uses OpenAI API to create engaging event descriptions
- Supports both English and Hebrew
- Located in `backend/services/agent/`

### Vector Search
- PostgreSQL pgvector extension for semantic search
- Generates embeddings for event content
- Enables personalized recommendations
- Implementation in `backend/services/embeddings/`

### Admin Dashboard
- Modular event form split by sections
- Real-time validation
- Draft saving capability
- Located in `frontend/src/pages/admin/`

### File Upload System
- Direct upload to AWS S3
- Supports multiple images per event
- Automatic URL generation
- Implementation in `backend/services/s3/`

---

## Architecture Decisions

### Why Docker?
- Consistent environment across development and production
- Easy onboarding for new developers
- Isolated dependencies

### Why Separate Dev/Prod Compose Files?
- Dev includes hot reload (nodemon, React file polling)
- Different port mappings and volume mounts
- Separate environment configurations

### Why Lambda for Cleanup?
- Decoupled from main application
- Scheduled execution without server overhead
- Independent scaling and monitoring

### Why Supabase + PostgreSQL?
- Managed PostgreSQL with built-in auth
- pgvector extension for embeddings
- Real-time subscriptions capability
- Simplified backend infrastructure

---

## Development Workflow

1. **Feature Development:**
   - Create feature branch from `develop`
   - Develop using `docker-compose.dev.yml`
   - Test locally

2. **Code Review:**
   - Submit PR to `develop` branch
   - Review and approval process

3. **Deployment:**
   - Merge to `main` triggers production deployment
   - AWS Elastic Beanstalk handles container orchestration

---

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

---

## Contributing

This is a personal learning project, but suggestions and feedback are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

This project is open source and available for educational purposes.

---

## Contact

Built by Ben Carmel - Software Engineering Intern & CS Student

- GitHub: [@BenCarmel123](https://github.com/BenCarmel123)
- Project: [FattyPopups](https://github.com/BenCarmel123/fattypopups)

---

## Learning Notes

This project serves as a sandbox for learning:
- Backend engineering fundamentals
- AI engineering and API integration
- Production system design
- End-to-end product ownership
- Smart AI tooling usage

Every technical decision is a teaching opportunity - focused on understanding the "why" behind choices, not just the "how."