const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const cron = require('node-cron');
const fs = require('fs');

// Initialize app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Event storage (using a simple file for demo purposes)
const eventsFile = './events.json';
const completedEventsFile = './completed-events.json';

const isEventCompleted = (event) => {
  return new Date(event.time) < new Date();
};


// Load events
let events;
try {
  if (fs.existsSync(eventsFile)) {
    const fileData = fs.readFileSync(eventsFile, 'utf8');
    events = fileData ? JSON.parse(fileData) : [];
  } else {
    events = [];
  }
} catch (error) {
  console.error('Error reading events file:', error);
  events = []; // Fallback to an empty array
}


// WebSocket setup
const wss = new WebSocket.Server({ port: 8080 });
let clients = [];

// Handle WebSocket connections
wss.on('connection', (ws) => {
  clients.push(ws);
  ws.on('close', () => {
    clients = clients.filter((client) => client !== ws);
  });
});

// Notify function
function notifyClients(message) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Add Event
app.post('/events', (req, res) => {
  const { title, description, time } = req.body;

  if (!title || !description || !time) {
    return res.status(400).send({ error: 'Title, description, and time are required!' });
  }

  const newEvent = { id: Date.now(), title, description, time };
  events.push(newEvent);
  events.sort((a, b) => new Date(a.time) - new Date(b.time));

  // Save to file
  fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
  res.status(201).send(newEvent);
});

// Get Events
app.get('/events', (req, res) => {
  const upcomingEvents = events.filter((event) => new Date(event.time) > new Date());
  res.send(upcomingEvents);
});

// Event notifier cron job
cron.schedule('* * * * *', () => {
  const now = new Date();
  const upcoming = events.filter((event) => new Date(event.time) - now <= 5 * 60 * 1000 && new Date(event.time) > now);

  upcoming.forEach((event) => {
    notifyClients({ type: 'reminder', event });
  });

  const completed = events.filter((event) => new Date(event.time) <= now);
  events = events.filter((event) => new Date(event.time) > now);

  // Log completed events
  const cron = require('node-cron');
const fs = require('fs');

const completedEventsFile = './completed-events.json'; // Ensure this matches your file path

// Helper function to determine if an event is completed
const isEventCompleted = (event) => {
  return new Date(event.time) < new Date();
};

// Cron job to check for completed events every minute
cron.schedule('* * * * *', () => {
  console.log('Checking for completed events...');
  
  const now = new Date();
  const completedEvents = events.filter(isEventCompleted);

  if (completedEvents.length > 0) {
    console.log('Completed events found:', completedEvents);

    // Save completed events to file
    fs.readFile(completedEventsFile, (err, data) => {
      let existingData = [];
      if (!err && data) {
        try {
          existingData = JSON.parse(data);
        } catch (parseErr) {
          console.error('Error parsing completed events file:', parseErr);
        }
      }

      const updatedData = [...existingData, ...completedEvents];

      // Write updated data back to the file
      fs.writeFile(completedEventsFile, JSON.stringify(updatedData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing completed events to file:', writeErr);
        } else {
          console.log('Completed events logged successfully.');
        }
      });
    });

    // Remove completed events from active `events` list
    events = events.filter(event => !isEventCompleted(event));
  } else {
    console.log('No completed events at this time.');
  }
});


  // Save updated events
  fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
});

// Overlapping events notifier
app.post('/events/overlap', (req, res) => {
  const { time } = req.body;
  const overlapping = events.filter(
    (event) =>
      Math.abs(new Date(event.time) - new Date(time)) <= 5 * 60 * 1000
  );

  if (overlapping.length > 0) {
    res.send({ overlap: true, overlapping });
  } else {
    res.send({ overlap: false });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
