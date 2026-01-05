# Media Tracker Backend

This backend provides a REST API for the Media Tracker application using Express.js and SQLite.

## Project Structure

```
src/backend/
├── server.ts          # Express server setup and initialization
├── db.ts             # SQLite database connection and initialization
├── mediaService.ts   # Business logic for media operations
├── routes.ts         # API route handlers
└── README.md         # This file
```

## Features

- **SQLite Database**: Local database for persistent data storage
- **REST API**: Standard CRUD operations for media items
- **CORS Support**: Enabled for frontend communication
- **Error Handling**: Comprehensive error handling and validation
- **Data Persistence**: All data is saved to `data/mediatracker.db`

## Installation

1. Install dependencies:
```bash
npm install
```

This will install:
- `express` - Web framework
- `cors` - CORS middleware
- `sqlite3` - SQLite driver
- `uuid` - ID generation
- `tsx` - TypeScript execution (dev)
- `concurrently` - Run multiple commands (dev)

## Running the Backend

### Option 1: Run backend only
```bash
npm run server
```
Server will start at `http://localhost:5000`

### Option 2: Run backend and frontend together
```bash
npm run dev:all
```
This runs both the Express server and Vite dev server concurrently.

## API Endpoints

### Create Media
**POST** `/api/media`

Request body:
```json
{
  "title": "The Great Gatsby",
  "type": "book",
  "status": "consumed",
  "rating": 5,
  "year": 2024,
  "review": "Amazing book!",
  "cover": "https://example.com/cover.jpg"
}
```

### Get All Media
**GET** `/api/media`

Returns array of all media items sorted by creation date (newest first).

### Get Media by ID
**GET** `/api/media/{id}`

Returns a specific media item by its ID.

### Update Media
**PUT** `/api/media/{id}`

Request body (partial update):
```json
{
  "rating": 4,
  "review": "Updated review"
}
```

### Delete Media
**DELETE** `/api/media/{id}`

Deletes a media item.

### Health Check
**GET** `/health`

Returns server status.

## Database Schema

The SQLite database includes a `media` table with the following columns:

| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| title | TEXT | NOT NULL |
| type | TEXT | NOT NULL, CHECK IN ('book', 'movie', 'game', 'tv-show', 'album') |
| status | TEXT | NOT NULL, CHECK IN ('want-to-consume', 'consuming', 'consumed') |
| rating | INTEGER | NOT NULL, CHECK >= 1 AND <= 5 |
| year | INTEGER | |
| review | TEXT | |
| cover | TEXT | |
| createdAt | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | DATETIME | DEFAULT CURRENT_TIMESTAMP |

## Environment Variables

- `PORT` - Server port (default: 5000)

Set via `.env` file or command line:
```bash
PORT=3000 npm run server
```

## Database File Location

The SQLite database is stored at: `data/mediatracker.db`

The `data` directory is created automatically on first run.

## Error Handling

All endpoints return consistent error responses:

**400 Bad Request**: Missing or invalid fields
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

**404 Not Found**: Media item not found
```json
{
  "error": "Media not found"
}
```

**500 Internal Server Error**: Server error
```json
{
  "error": "Failed to operation",
  "details": "Error details"
}
```

## Integration with Frontend

The frontend should call the backend API at `http://localhost:5000/api/media`.

Update `src/app/App.tsx` with:
```typescript
const API_URL = 'http://localhost:5000/api/media';

// Example fetch call
const fetchMediaList = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    setMediaList(data.data);
  } catch (error) {
    console.error('Failed to fetch media:', error);
  }
};
```

## Development

The backend uses TypeScript with `tsx` for running TypeScript directly without compilation.

To build for production:
```bash
npm run build
```

Then run with Node:
```bash
node dist/backend/server.js
```

## Troubleshooting

### Database locked error
If you get a "database is locked" error, ensure only one instance is running.

### Port already in use
Change the port using the environment variable:
```bash
PORT=5001 npm run server
```

### Missing database directory
The `data` directory is created automatically. If issues persist, create it manually:
```bash
mkdir -p data
```

## Next Steps

- Connect the frontend to this backend
- Add authentication (JWT tokens)
- Add request validation middleware
- Add logging system
- Add database backup functionality
