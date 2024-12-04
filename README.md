# Event-Notifier-API-milestone1
# Real-Time Event Notifier API

This repository contains a **Real-Time Event Notifier API** that helps users manage and receive real-time notifications for scheduled events such as meetings, deadlines, or reminders. The API ensures users stay updated about important tasks and provides functionality to log completed events for future reference.

## Features

1. **Create Events**: Add events with a title, description, and scheduled time.
2. **List Events**: Retrieve all upcoming events.
3. **Real-Time Notifications**:
   - Notify users 5 minutes before an event starts using WebSocket.
   - Notify users if events overlap.
4. **Log Completed Events**: Automatically log events that have passed to a file for historical reference.
5. **Fetch Completed Events**: Retrieve logged completed events through an API endpoint.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for API endpoints.
- **WebSocket (ws)**: Real-time notifications.
- **node-cron**: Scheduler for checking and logging completed events.
- **File System (fs)**: To handle completed event logging.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/real-time-event-notifier-api.git
   cd real-time-event-notifier-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. The server will start at `http://localhost:8080`.

## API Endpoints

### 1. Add Event
**POST** `/events`

Add a new event with the following JSON body:
```json
{
  "id": 1694108700000,
  "title": "Project Meeting",
  "description": "Discuss the new project requirements.",
  "time": "2024-12-04T14:00:00"
}
```

**Response:**
- `201 Created`: Event successfully added.

### 2. Get Upcoming Events
**GET** `/events`

Retrieve all upcoming events.

**Response:**
- `200 OK`: List of events.
```json
[
  {
    "id": 1694108700000,
    "title": "Project Meeting",
    "description": "Discuss the new project requirements.",
    "time": "2024-12-04T14:00:00"
  }
]
```

### 3. Get Completed Events
**GET** `/completed-events`

Retrieve a list of completed events that have been logged.

**Response:**
- `200 OK`: List of completed events.
```json
[
  {
    "id": 1694108700000,
    "title": "Project Meeting",
    "description": "Discuss the new project requirements.",
    "time": "2024-12-04T14:00:00"
  }
]
```

## Real-Time Notifications

The WebSocket server sends notifications to connected clients:
1. **5-Minute Reminder**: Notifies users 5 minutes before an event starts.
2. **Overlap Notification**: Alerts users if events overlap.

### WebSocket Instructions
1. Connect to the WebSocket server at `ws://localhost:8080`.
2. Listen for notifications in the following format:
   ```json
   {
     "type": "reminder",
     "event": {
       "id": 1694108700000,
       "title": "Project Meeting",
       "description": "Discuss the new project requirements.",
       "time": "2024-12-04T14:00:00"
     }
   }
   ```

## How It Works

1. **Add Events**: Users can add events via the `/events` endpoint.
2. **Real-Time Notifications**:
   - The server continuously monitors the `events` array.
   - Notifications are sent to clients 5 minutes before an event starts.
3. **Log Completed Events**:
   - A `node-cron` job runs every minute to check for events that have passed their scheduled time.
   - Completed events are logged into `completedEvents.json`.
4. **Fetch Logged Events**: Use the `/completed-events` endpoint to retrieve logged events.

## Testing with Postman

1. **Import the Collection**: Create a new Postman collection with the above endpoints.
2. **Test Adding Events**: Send a `POST` request to `/events` with a valid JSON body.
3. **Test Listing Events**: Send a `GET` request to `/events` to verify your added events.
4. **Test Completed Events**: Wait for an event to pass and check `/completed-events`.

## Troubleshooting

- **Port in Use**: If you encounter `EADDRINUSE`, change the port in `server.js` or stop any other service using the port.
- **Completed Events Not Logging**: Ensure the `completedEvents.json` file exists and has write permissions.

