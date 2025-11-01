# 🍽️ FattyPopups

**FattyPopups** is a full-stack web application that promotes local culinary pop-up events and independent chefs through AI-assisted descriptions and automated poster generation.  
Built with **Node.js**, **React**, **PostgreSQL**, **Docker**, and **AWS**, the platform streamlines event discovery and marketing for small culinary talents.

---

## 🚀 Features

- 🧠 **AI-Generated Event Content** – Automatically creates bilingual (English/Hebrew) event descriptions using the OpenAI API.  
- 🖼️ **Dynamic Image Uploads** – Supports image hosting via AWS S3 for event posters and chef profiles.  
- 🗓️ **Dashboard for Organizers** – Create, edit, and manage culinary events through a modern React interface.  
- 🔍 **Vector Search (PostgreSQL + pgvector)** – Enables semantic search and personalized event recommendations.  
- ⚙️ **Dockerized Full-Stack Setup** – Runs locally or in production using Docker Compose for seamless environment consistency.

---

## 🧩 Tech Stack

| Layer | Technology |
|:------|:------------|
| Frontend | React.js, Chakra UI, Axios |
| Backend | Node.js, Express.js |
| Database | Supabase / PostgreSQL (with pgvector) |
| AI Integration | OpenAI API |
| Cloud Hosting | AWS Elastic Beanstalk, S3 |
| Containerization | Docker & Docker Compose |
| Version Control | Git & GitHub |

---

## 🐳 Local Development (Dockerized)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/fattypopups.git
cd fattypopups
