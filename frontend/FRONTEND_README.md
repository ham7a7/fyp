# Frontend - AI Chatbot Builder

A modern Next.js frontend for the AI Chatbot Builder application with complete authentication system.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Login page
│   ├── register/         # Register page
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── page.tsx          # Landing page
├── components/            # Reusable React components
│   ├── auth/             # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   └── ui/               # UI components
│       ├── Button.tsx
│       └── Input.tsx
├── contexts/             # React Context providers
│   └── AuthContext.tsx   # Authentication context & provider
├── hooks/                # Custom React hooks
│   └── usePublicRoute.ts # Hook for public route protection
├── lib/                  # Library code & utilities
│   ├── api-client.ts     # HTTP client wrapper
│   └── withAuth.tsx      # HOC for protected routes
├── services/             # API service layer
│   └── auth.service.ts   # Authentication API calls
└── types/                # TypeScript type definitions
    └── auth.ts           # Auth-related types
```

## 🚀 Features

### Authentication System
- **Register**: User registration with validation
- **Login**: Secure login with session management
- **Logout**: Clean logout with session cleanup
- **Protected Routes**: Automatic route protection
- **Public Routes**: Auto-redirect authenticated users
- **Session Persistence**: Cookie-based sessions

### UI Components
- **Button**: Customizable button with loading states
- **Input**: Form input with labels and error messages
- **Forms**: Pre-built login and register forms
- **Responsive Design**: Mobile-first Tailwind CSS

### Architecture
- **Context API**: Global authentication state
- **Service Layer**: Separated API logic
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error management

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- Backend server running on port 3000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3001`

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000` |

## 🔗 API Integration

The frontend connects to these backend endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login  
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

## 🎨 Styling

- **Framework**: Tailwind CSS 4
- **Design**: Modern, clean, and responsive
- **Components**: Reusable styled components

## 📱 Pages

### Landing Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Navigation to login/register

### Login Page (`/login`)
- Email/password form
- Error handling
- Link to registration
- Auto-redirect if authenticated

### Register Page (`/register`)
- Name, email, password fields
- Password confirmation
- Validation
- Auto-login after registration

### Dashboard (`/dashboard`)
- Protected route
- User welcome message
- Logout functionality
- Placeholder for bot management

## 🔐 Authentication Flow

### Registration
1. User fills registration form
2. Frontend validates input
3. POST request to `/auth/register`
4. Auto-login on success
5. Redirect to dashboard

### Login
1. User enters credentials
2. POST request to `/auth/login`
3. Session cookie stored
4. Redirect to dashboard

### Route Protection
1. AuthContext checks authentication on mount
2. Redirects to login if not authenticated
3. Public routes redirect to dashboard if authenticated

## 🧩 Usage Examples

### Using Authentication Context

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Routes with HOC

```tsx
import { withAuth } from '@/lib/withAuth';

function ProtectedPage() {
  return <div>This page is protected</div>;
}

export default withAuth(ProtectedPage);
```

### Using Public Route Hook

```tsx
import { usePublicRoute } from '@/hooks/usePublicRoute';

export function LoginPage() {
  const { isLoading } = usePublicRoute();

  if (isLoading) return <div>Loading...</div>;

  return <LoginForm />;
}
```

## 🔧 Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📦 Dependencies

### Core
- `next` - React framework
- `react` & `react-dom` - React library
- `typescript` - Type safety

### Dev Dependencies
- `tailwindcss` - CSS framework
- `eslint` - Code linting
- `@types/*` - TypeScript types

## 🚧 Next Steps

To extend the frontend:

1. **Add more pages**: Create pages for bot management, analytics, etc.
2. **Enhance forms**: Add more validation and error handling
3. **Add notifications**: Toast/snackbar for user feedback
4. **Implement themes**: Dark mode support
5. **Add tests**: Unit and integration tests

## 📄 License

This project is part of the AI Chatbot Builder FYP.
