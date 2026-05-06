# Axios API Client - Usage Guide

The API client has been updated to use **Axios** instead of the native Fetch API for improved error handling, interceptors, and a cleaner API.

## Features

- ✅ **Axios-based**: Better error handling and interceptors
- ✅ **Automatic JSON parsing**: No need to manually call `.json()`
- ✅ **Cookie support**: `withCredentials: true` for session management
- ✅ **Error interceptor**: Automatic error message extraction
- ✅ **TypeScript**: Full type safety with generics
- ✅ **Response interceptors**: Centralized error handling

## Installation

Axios is already installed:
```bash
npm install axios
```

## Basic Usage

### Import the API Client

```typescript
import { apiClient } from '@/lib/api-client';
```

### GET Request

```typescript
// Without type safety
const data = await apiClient.get('/api/endpoint');

// With type safety
interface User {
  id: string;
  name: string;
  email: string;
}

const user = await apiClient.get<User>('/api/users/123');
console.log(user.name); // TypeScript knows this is a string
```

### POST Request

```typescript
interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

interface UserResponse {
  message: string;
  user: User;
}

const newUser = await apiClient.post<UserResponse>(
  '/api/users',
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'secret123'
  }
);

console.log(newUser.message); // "User created successfully"
```

### PUT Request

```typescript
const updatedUser = await apiClient.put<User>(
  '/api/users/123',
  {
    name: 'Jane Doe',
    email: 'jane@example.com'
  }
);
```

### PATCH Request

```typescript
const partialUpdate = await apiClient.patch<User>(
  '/api/users/123',
  {
    name: 'New Name'
  }
);
```

### DELETE Request

```typescript
const result = await apiClient.delete<{ message: string }>('/api/users/123');
console.log(result.message); // "User deleted"
```

## Advanced Usage

### Custom Headers

```typescript
const data = await apiClient.get('/api/endpoint', {
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

### Query Parameters

```typescript
const users = await apiClient.get('/api/users', {
  params: {
    page: 1,
    limit: 10,
    sort: 'name'
  }
});
// Automatically converts to: /api/users?page=1&limit=10&sort=name
```

### Timeout

```typescript
const data = await apiClient.get('/api/slow-endpoint', {
  timeout: 5000 // 5 seconds
});
```

### Access Raw Axios Instance

For advanced Axios features:

```typescript
const axiosInstance = apiClient.getAxiosInstance();

// Add custom interceptors
axiosInstance.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});

// Use all Axios features
const response = await axiosInstance.get('/api/data');
```

## Error Handling

The API client automatically handles errors through an interceptor:

```typescript
try {
  const data = await apiClient.post('/api/endpoint', { data: 'value' });
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    // Error message is automatically extracted from:
    // - error.response.data.message (server error message)
    // - or a fallback message
  }
}
```

### Error Types

1. **Server Error (4xx, 5xx)**:
   - Extracts `message` from response body
   - Falls back to "An error occurred"

2. **Network Error**:
   - "No response from server. Please check your connection."

3. **Request Setup Error**:
   - Original error message or "An unexpected error occurred"

## Authentication Service Example

Here's how the auth service uses the API client:

```typescript
import { apiClient } from '@/lib/api-client';

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Axios automatically:
    // - Sets Content-Type: application/json
    // - Stringifies the body
    // - Parses the JSON response
    // - Includes cookies (withCredentials: true)
    return apiClient.post<AuthResponse>('/auth/register', credentials);
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  async logout(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/logout');
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      return response.user;
    } catch (error) {
      return null; // Not authenticated
    }
  },
};
```

## Configuration

The API client is configured in `src/lib/api-client.ts`:

```typescript
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});
```

### Environment Variables

Set the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Response Structure

With Axios, you get the data directly:

```typescript
// ❌ Old Fetch way
const response = await fetch('/api/users');
const data = await response.json();
console.log(data.users);

// ✅ New Axios way
const data = await apiClient.get<UserResponse>('/api/users');
console.log(data.users); // Data is already parsed
```

## Interceptors

The API client includes a response interceptor for error handling. You can add more:

```typescript
const axiosInstance = apiClient.getAxiosInstance();

// Request interceptor (runs before request)
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token, log request, etc.
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (runs after response)
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Comparison: Fetch vs Axios

| Feature | Fetch | Axios |
|---------|-------|-------|
| JSON parsing | Manual `.json()` | Automatic |
| Error handling | Check `response.ok` | Automatic for non-2xx |
| Request/Response interceptors | ❌ | ✅ |
| Query params | Manual string building | Automatic with `params` |
| Timeout | Manual AbortController | Built-in `timeout` option |
| Progress tracking | ReadableStream | `onUploadProgress`, `onDownloadProgress` |
| CSRF protection | Manual | Built-in with `withCredentials` |
| TypeScript support | Good | Excellent |

## Migration from Fetch

If you have existing Fetch code, here's how to migrate:

```typescript
// ❌ Before (Fetch)
const response = await fetch(`${API_URL}/users`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({ name: 'John' }),
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message);
}

const data = await response.json();

// ✅ After (Axios)
const data = await apiClient.post('/users', { name: 'John' });
```

## Best Practices

1. **Always use TypeScript generics**:
   ```typescript
   const user = await apiClient.get<User>('/users/123');
   ```

2. **Handle errors properly**:
   ```typescript
   try {
     const data = await apiClient.post('/endpoint', payload);
   } catch (error) {
     if (error instanceof Error) {
       toast.error(error.message);
     }
   }
   ```

3. **Create service layers**:
   ```typescript
   // services/user.service.ts
   export const userService = {
     getAll: () => apiClient.get<User[]>('/users'),
     getById: (id: string) => apiClient.get<User>(`/users/${id}`),
     create: (data: CreateUserDto) => apiClient.post<User>('/users', data),
     update: (id: string, data: UpdateUserDto) => 
       apiClient.put<User>(`/users/${id}`, data),
     delete: (id: string) => apiClient.delete(`/users/${id}`),
   };
   ```

4. **Use query params for filters**:
   ```typescript
   const users = await apiClient.get('/users', {
     params: { role: 'admin', active: true }
   });
   ```

## Debugging

Enable Axios debugging:

```typescript
const axiosInstance = apiClient.getAxiosInstance();

axiosInstance.interceptors.request.use((config) => {
  console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
  console.log('📦 Data:', config.data);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.message);
    console.error('📍 URL:', error.config?.url);
    console.error('📦 Data:', error.response?.data);
    return Promise.reject(error);
  }
);
```

## Summary

The Axios-based API client provides:
- ✅ Cleaner, more intuitive API
- ✅ Better error handling
- ✅ Automatic JSON parsing
- ✅ Request/response interceptors
- ✅ Built-in features (timeout, query params, etc.)
- ✅ Full TypeScript support
- ✅ Cookie/session management

No changes needed in your existing code - the service layer remains the same!
