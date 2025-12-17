# Intent Feature - Frontend Implementation

## Overview
The Intent feature allows users to train their bots to understand and respond to specific user queries. Intents are the building blocks of conversational AI, defining what users might say and how the bot should respond.

## Features Implemented

### 1. **Intent Management**
- ✅ Create new intents with training phrases and responses
- ✅ View all intents for a specific bot
- ✅ Delete intents (when backend supports it)
- ✅ Support for webhook/fulfillment responses
- ✅ Dynamic training phrases and responses

### 2. **Intent Properties**
Each intent includes:
- **Name**: Unique identifier for the intent (e.g., "greeting", "pricing_question")
- **Training Phrases**: Example user inputs that trigger this intent
- **Responses**: Bot's replies when the intent is matched
- **Is Fulfillment**: Whether to use a webhook for dynamic responses
- **Webhook URL**: External endpoint for custom response logic
- **Webhook Headers**: Custom headers for webhook requests

## File Structure

```
frontend/src/
├── types/
│   └── intent.ts                       # TypeScript interfaces for intent types
├── services/
│   └── intent.service.ts               # API service for intent operations
├── components/
│   └── intent/
│       ├── IntentList.tsx              # List all bot intents
│       └── CreateIntentForm.tsx        # Create new intent form
└── app/
    └── dashboard/
        └── bots/
            └── [botId]/
                └── intents/
                    ├── page.tsx        # Intent list page
                    └── create/
                        └── page.tsx    # Create intent page
```

## Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/dashboard/bots/[botId]/intents` | View all intents for a bot | ✅ |
| `/dashboard/bots/[botId]/intents/create` | Create a new intent | ✅ |

## API Endpoints

All endpoints are prefixed with `/api/bots/:botId/intents`:

| Method | Endpoint | Description | Backend Status |
|--------|----------|-------------|----------------|
| POST | `/create` | Create a new intent | ✅ Implemented |
| GET | `/` | Get all intents for bot | ⏳ Not yet implemented |
| PATCH | `/update` | Update an intent | ⏳ Not yet implemented |
| DELETE | `/delete` | Delete an intent | ⏳ Not yet implemented |
| POST | `/get` | Get specific intent | ⏳ Not yet implemented |

## Components

### CreateIntentForm

A comprehensive form for creating intents with:

**Features:**
- Intent name input
- Dynamic training phrases (add/remove)
- Dynamic responses (add/remove)
- Webhook/fulfillment toggle
- Webhook URL configuration
- Form validation
- Success/error messaging

**Usage:**
```tsx
<CreateIntentForm botId="bot123" />
```

**Validation:**
- At least one training phrase required
- At least one response required
- Training phrases must be non-empty strings
- Responses must be non-empty strings
- Intent name must be 3-100 characters

### IntentList

Displays all intents for a bot with:

**Features:**
- Grid/card layout for intents
- Shows training phrases (first 5)
- Shows responses (first 2)
- Delete functionality
- Webhook status indicator
- Empty state with CTA
- Graceful handling of unimplemented backend endpoints

**Usage:**
```tsx
<IntentList botId="bot123" />
```

## Creating an Intent

### Basic Intent Example

```typescript
import { intentService } from '@/services/intent.service';

const createGreetingIntent = async (botId: string) => {
  const response = await intentService.createIntent(botId, {
    name: 'greeting',
    trainingPhrases: [
      'Hello',
      'Hi',
      'Hey there',
      'Good morning',
      'Good afternoon'
    ],
    responses: [
      'Hello! How can I help you today?',
      'Hi there! What can I do for you?',
      'Hey! I\'m here to assist you.'
    ],
    isFulfillment: false
  });
  
  console.log('Intent created:', response.intent);
};
```

### Webhook-Enabled Intent Example

```typescript
const createDynamicIntent = async (botId: string) => {
  const response = await intentService.createIntent(botId, {
    name: 'weather_query',
    trainingPhrases: [
      'What\'s the weather?',
      'How\'s the weather today?',
      'Tell me the weather forecast'
    ],
    responses: [
      'Let me check the weather for you...'
    ],
    isFulfillment: true,
    webhookUrl: 'https://api.example.com/weather',
    webhookHeaders: [
      { key: 'Authorization', value: 'Bearer token123' }
    ]
  });
};
```

## Integration with Bot Detail

The bot detail page now includes a "Manage Intents" card that navigates to the intent management interface. This provides easy access to intent configuration alongside other bot features.

## UI/UX Features

1. **Dynamic Form Fields**: Add/remove training phrases and responses on the fly
2. **Responsive Design**: Works on mobile, tablet, and desktop
3. **Loading States**: Clear loading indicators during API calls
4. **Error Handling**: Helpful error messages and graceful degradation
5. **Empty States**: Friendly prompts when no intents exist
6. **Webhook Toggle**: Advanced users can enable webhook fulfillment
7. **Visual Indicators**: Tags for webhook-enabled intents
8. **Preview Mode**: Shows first few training phrases/responses in list view

## Training Phrases Best Practices

When creating training phrases:

1. **Variety**: Include different ways users might phrase the same question
2. **Natural Language**: Use conversational, real-world language
3. **Length Variation**: Mix short and long phrases
4. **Common Misspellings**: Consider including common typos (if supported)
5. **Context**: Include context-specific variations

Example:
```
Training Phrases for "pricing_question":
- "How much does it cost?"
- "What's the price?"
- "Pricing information"
- "Can you tell me about pricing?"
- "What are your rates?"
- "How expensive is it?"
```

## Response Strategies

### Multiple Responses
The bot will randomly select from available responses to make conversations feel more natural:

```typescript
responses: [
  "I'd be happy to help you with that!",
  "Sure thing! Let me assist you with that.",
  "Of course! I'm here to help."
]
```

### Fallback Intent
Create a fallback intent for unmatched queries:

```typescript
{
  name: 'fallback',
  trainingPhrases: [
    'I don\'t understand',
    'What?',
    'Help'
  ],
  responses: [
    'I\'m not sure I understand. Could you rephrase that?',
    'Sorry, I didn\'t catch that. Can you try asking differently?'
  ],
  isFulfillment: false
}
```

## Webhook Fulfillment

When `isFulfillment` is true, the bot will:

1. Recognize the user intent from training phrases
2. Send a request to the specified webhook URL
3. Use the webhook response instead of predefined responses

**Webhook Request Format:**
```json
{
  "intent": "weather_query",
  "userMessage": "What's the weather?",
  "botId": "bot123",
  "sessionId": "session456"
}
```

**Expected Webhook Response:**
```json
{
  "response": "It's currently 72°F and sunny in your area!"
}
```

## Error Handling

The implementation gracefully handles:

- **Backend Not Ready**: Shows helpful message when listing endpoint isn't implemented
- **Network Errors**: Clear error messages with retry options
- **Validation Errors**: Client-side validation before submission
- **Empty States**: Friendly prompts to create first intent

## Future Enhancements

Planned features when backend support is added:

- ✅ Edit existing intents
- ✅ Detailed intent view
- ✅ Intent analytics (trigger count, success rate)
- ✅ Intent testing interface
- ✅ Bulk import/export intents
- ✅ Intent parameters/entities
- ✅ Context management
- ✅ Intent prioritization

## Testing

To test the intent feature:

1. Navigate to a bot detail page
2. Click "Manage Intents"
3. Click "Create New Intent"
4. Fill in the form:
   - Name: `greeting`
   - Training Phrases: Add 3-5 greetings
   - Responses: Add 2-3 responses
5. Submit the form
6. Verify intent appears in the list

## Dependencies

- React 18+
- Next.js 14+
- TypeScript
- Axios (via api-client)
- Tailwind CSS

## Backend Integration Notes

The frontend is designed to work with the current backend implementation while being extensible for future features:

- ✅ Create intent: Fully functional
- ⏳ List intents: Frontend ready, shows helpful message if not implemented
- ⏳ Update intent: Service method exists, waiting for backend
- ⏳ Delete intent: Service method exists, waiting for backend

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for dynamic content
- Focus management in forms
- Screen reader friendly error messages

## Performance Considerations

- Debounced input validation
- Optimistic UI updates
- Efficient re-rendering with React hooks
- Lazy loading of intent lists
- Client-side filtering (when implemented)

## Security

- Authentication required for all routes
- Bot ownership verification (backend)
- Input sanitization
- XSS protection
- CSRF protection via cookies
