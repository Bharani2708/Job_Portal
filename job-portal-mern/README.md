# JobConnect - MERN Job Portal

A beginner-friendly full-stack MERN job portal with:
- Job seeker and recruiter registration/login
- JWT authentication
- bcrypt password hashing
- Role-based access
- Recruiter job CRUD
- Job search/filter
- Job applications
- Application status tracking
- Recruiter applicant management
- React Router
- Redux Toolkit
- Axios

## Requirements
- Node.js
- MongoDB running locally or a MongoDB Atlas connection

## Backend setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

On PowerShell, if `copy` does not work:
```powershell
Copy-Item .env.example .env
```

Backend runs on http://localhost:5000

## Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## Demo accounts
Create accounts from the Register page. Select either:
- Job Seeker
- Recruiter

A recruiter can create jobs. A job seeker can apply.

## Important
Never commit `.env` or real secrets to GitHub.
