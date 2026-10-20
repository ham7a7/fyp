# Setup Guide

This guide will help you set up and run the AI Chatbot Builder application.

## Prerequisites

- Node.js 18 or higher
- MongoDB instance running
- Git

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_CONNECTION_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
COOKIE_SECRET=your_cookie_secret
FRONTEND_URL=http://localhost:3001

# AI models: AI_PROVIDER is "openai" or "openrouter"
AI_PROVIDER=openai
AI_CHAT_MODEL=gpt-4o
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key  # only needed when AI_PROVIDER=openrouter

# Cloudflare R2 (knowledge file storage)
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_bucket
R2_FOLDER_NAME=documents
R2_ENDPOINT_URL=https://<account_id>.r2.cloudflarestorage.com
```

4. Build the TypeScript code:
```bash
npm run build
```

5. Start the backend server:
```bash
npm run dev
```

The backend will be running on `http://localhost:3000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:3001`

## Running Both Servers

You can run both servers simultaneously using two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## Testing the Authentication

1. Open your browser and go to `http://localhost:3001`
2. Click "Register" to create a new account
3. Fill in the registration form with:
   - Name
   - Email
   - Password (minimum 6 characters)
   - Confirm Password
4. You'll be automatically logged in and redirected to the dashboard
5. To test login, click "Logout" and then "Login" to sign in again

## API Endpoints

The backend exposes the following authentication endpoints:

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password
- `POST /auth/logout` - Logout the current user
- `GET /auth/me` - Get the current authenticated user

## Troubleshooting

### CORS Issues

If you encounter CORS errors, make sure:
- Backend `FRONTEND_URL` in `.env` matches your frontend URL
- Frontend `NEXT_PUBLIC_API_URL` in `.env.local` matches your backend URL
- Both servers are running

### Session Issues

If you can't stay logged in:
- Check that MongoDB is running
- Verify `SESSION_SECRET` and `COOKIE_SECRET` are set in backend `.env`
- Clear your browser cookies and try again

### Build Errors

If TypeScript compilation fails:
```bash
# Backend
cd backend
npm run typecheck

# Frontend  
cd frontend
npm run build
```

## Project Structure

```
aichatbotbuilder-fyp/
├── backend/
│   ├── src/
│   │   ├── handlers/     # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── database/     # MongoDB schemas
│   │   ├── middlewares/  # Express middlewares
│   │   └── index.ts      # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   └── package.json
└── README.md
```

## Next Steps

After setting up the application:

1. Explore the codebase structure
2. Test all authentication flows
3. Check the browser DevTools for any console errors
4. Review the backend logs for API requests

## Support

For issues or questions, refer to:
- Frontend README: `frontend/FRONTEND_README.md`
- Backend README: `backend/README.md`
