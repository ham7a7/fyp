# Bot Feature - Frontend Implementation

## Overview
The Bot feature allows authenticated users to create, manage, and interact with AI chatbots. This implementation provides a complete CRUD interface for bot management.

## Features Implemented

### 1. **Bot Management**
- ✅ Create new bots with custom configurations
- ✅ View all user bots in a grid layout
- ✅ View detailed bot information
- ✅ Edit existing bot properties
- ✅ Delete bots with confirmation
- ✅ Refresh API keys and public bot IDs

### 2. **Bot Properties**
Each bot includes:
- **Name**: Display name for the bot
- **Description**: What the bot does
- **Use Case**: Specific application (e.g., Customer Support, FAQ Assistant)
- **Language**: Bot's primary language (English, Spanish, French, etc.)
- **Status**: Active/Inactive status
- **Public Bot ID**: Used for widget integration
- **API Key**: For mobile and backend integrations

## File Structure

```
frontend/src/
├── types/
│   └── bot.ts                          # TypeScript interfaces for bot types
├── services/
│   └── bot.service.ts                  # API service for bot operations
├── components/
│   └── bot/
│       ├── BotList.tsx                 # List all user bots
│       ├── CreateBotForm.tsx           # Create new bot form
│       ├── EditBotForm.tsx             # Edit bot form
│       └── BotDetail.tsx               # Bot detail view with credentials
└── app/
    └── dashboard/
        ├── layout.tsx                  # Shared layout with navigation
        ├── page.tsx                    # Dashboard home
        └── bots/
            ├── page.tsx                # Bot list page
            ├── create/
            │   └── page.tsx            # Create bot page
            └── [botId]/
                ├── page.tsx            # Bot detail page
                └── edit/
                    └── page.tsx        # Edit bot page
```

## Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/dashboard/bots` | View all user bots | ✅ |
| `/dashboard/bots/create` | Create a new bot | ✅ |
| `/dashboard/bots/[botId]` | View bot details | ✅ |
| `/dashboard/bots/[botId]/edit` | Edit bot | ✅ |

## API Endpoints Used

All endpoints are prefixed with `/bot`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create a new bot |
| DELETE | `/delete` | Delete a bot |
| PATCH | `/edit` | Update bot properties |
| POST | `/get-bot` | Get bot by ID (body) |
| GET | `/bot/:botId` | Get bot by ID (param) |
| GET | `/get-bots` | Get all user bots |
| PATCH | `/refresh-api-key` | Generate new API key |
| PATCH | `/refresh-bot-id` | Generate new public bot ID |
| POST | `/chat-with-bot` | Chat with bot |

## Components

### BotList
- Displays all user bots in a grid
- Shows bot name, description, use case, language, and status
- Quick actions: View, Edit, Delete
- Empty state with "Create First Bot" CTA

### CreateBotForm
- Form with fields: name, description, use case, language
- Language selector with 10+ languages
- Displays API key after successful creation (one-time view)
- Auto-redirects to bot list after 3 seconds

### EditBotForm
- Pre-populated form with existing bot data
- All fields optional (only send changed values)
- Success message and redirect to bot detail

### BotDetail
- Comprehensive bot information display
- API credentials section with copy-to-clipboard
- Refresh buttons for API key and public bot ID
- Edit and delete actions
- Metadata display (IDs, timestamps)

## Usage

### Creating a Bot

```typescript
import { botService } from '@/services/bot.service';

const createBot = async () => {
  const response = await botService.createBot({
    botName: 'Customer Support Bot',
    botDescription: 'Handles customer inquiries',
    botUsecase: 'Customer Support',
    botLanguage: 'English'
  });
  
  // Save the API key - won't be shown again!
  console.log('API Key:', response.apiKey);
};
```

### Getting All Bots

```typescript
const bots = await botService.getAllBots();
console.log('User bots:', bots.bots);
```

### Updating a Bot

```typescript
await botService.editBot({
  botId: '123',
  botName: 'Updated Name', // Optional
  botDescription: 'New description' // Optional
});
```

### Refreshing Credentials

```typescript
// Refresh API Key
const newKey = await botService.refreshAPIKey({ botId: '123' });
console.log('New API Key:', newKey.apiKey);

// Refresh Public Bot ID
await botService.refreshPublicBotId({ botId: '123' });
```

## Security Features

1. **Authentication Required**: All routes protected with `withAuth` HOC
2. **Owner Verification**: Backend verifies bot ownership
3. **API Key Encryption**: Keys encrypted in backend
4. **One-time API Key Display**: Shown only during creation/refresh

## UI/UX Features

1. **Responsive Design**: Works on mobile, tablet, desktop
2. **Loading States**: Spinners during API calls
3. **Error Handling**: Clear error messages
4. **Confirmation Dialogs**: For destructive actions (delete, refresh credentials)
5. **Copy to Clipboard**: Easy credential copying
6. **Navigation**: Breadcrumb-style navigation
7. **Empty States**: Helpful messages when no bots exist

## Integration with Dashboard

The dashboard layout includes:
- Top navigation bar with "My Bots" link
- Active route highlighting
- User info and logout button
- Quick action cards on dashboard home

## Next Steps

Future enhancements could include:
- Bot analytics dashboard
- Chat interface for testing
- Knowledge base management
- Intent configuration
- Widget code generator
- Bot deployment status
- Usage statistics

## Testing

To test the bot feature:

1. Start the backend server
2. Start the frontend dev server
3. Login with a valid account
4. Navigate to "My Bots" from dashboard
5. Create a new bot
6. Save the API key displayed
7. View, edit, and manage your bots

## Dependencies

- React 18+
- Next.js 14+
- TypeScript
- Axios (via api-client)
- Tailwind CSS (for styling)

## Notes

- API keys are shown only once (creation or refresh)
- Public Bot IDs are used for widget integration
- All timestamps are in local timezone
- Bot deletion is irreversible
- Refreshing credentials invalidates old ones immediately
