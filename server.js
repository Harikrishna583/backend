const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

// JWT Secret
const JWT_SECRET = "your_strong_random_secret_key_12345";

// Route imports
const authRoutes = require('./routes/auth');
const authRegisterRoutes = require('./routes/authRegisterRoutes');
const userTableData = require('./routes/userTableData');
const all_users = require('./routes/all_users');


const healthProfile = require("./routes/healthProfile");
const snack_options = require("./routes/number_of_snack_list");
const supplementFields = require("./routes/daily_supplements");


//Routers In Coach

const coachlogin = require("./routes/coach/coach_login");


// const ClientWeeklydataDateInserting = require("./routes/ClientWeeklydataDateInserting");
// const Client_weekly_body_mesurements_update = require("./routes/client_weekly_body_mesurements_update.js");
// const Client_weekly_body_composition_update = require("./routes/client_weekly_body_composition_update.js");
// const Client_weekly_body_pictures_update = require("./routes/client_weekly_body_pictures_update.js");









// =======================tf_wldialydata====================//
// const updateHealthData = require("./routes/tf_wldialydata/client_health_data_update.js");
const updateHealthData = require("./routes/tf_wldialydata/client_health_data_update.js");
const updateHealthSnacksData = require("./routes/tf_wldialydata/client_health_snacks_update.js");
const userProgram = require("./routes/tf_wldialydata/clientdailydata_dates_generator.js");
const clientdailyDateInserting = require("./routes/tf_wldialydata/ClientdailyDateInserting.js");
const dailyDietpics = require("./routes/tf_wldialydata/dailyDietpics.js");
const snack_Form = require("./routes/tf_wldialydata/snacksForm.js");
const HealthFormDataFetchedAndUpdating = require("./routes/tf_wldialydata/HealthFormDataFetchedAndUpdating.js");




// const healthProfile = require("./healthProfile.js");
// const snack_options = require("./number_of_snack_list.js");
// const supplementFields = require("./daily_supplements.js");

// // =======================tf_wlweeklydata====================//

const ClientWeeklydataDateInserting = require("./routes/tf_wlweeklydata/ClientWeeklydataDateInserting.js");
const Client_weekly_body_mesurements_update = require("./routes/tf_wlweeklydata/client_weekly_body_mesurements_update.js");
const Client_weekly_body_composition_update = require("./routes/tf_wlweeklydata/client_weekly_body_composition_update.js");
const Client_weekly_body_pictures_update = require("./routes/tf_wlweeklydata/client_weekly_body_pictures_update.js");



// // =======================tf_messages====================//
const chatMessagesUsersList = require('./routes/tf_messages/chatMessagesUsersList.js');
const messages = require('./routes/tf_messages/messages.js');
const send_messages = require('./routes/tf_messages/send_messages.js');


// // =======================dashboard====================//
const Graph = require('./routes/dashboard/graph.js');
const DashboardCard = require('./routes/dashboard/DashboardCard.js');








// client_weekly_body_composition_update


// Initialize Express and HTTP server
const app = express();
app.set('trust proxy', true);
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// const io = new Server(server, {
//   cors: {
//     origin: "https://thinkfitsolutions.com", // same as frontend domain
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

const io = new Server(server, {
  cors: {
    origin: ["https://thinkfitsolutions.com", "http://thinkfitsolutions.com"], // allow both
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  },
});


// Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));


// app.use(cors({
//   origin: "https://thinkfitsolutions.com", // your frontend domain
//   credentials: true
// }));

app.use(cors({
  origin: ["https://thinkfitsolutions.com", "http://thinkfitsolutions.com"],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));


app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/register', authRegisterRoutes);
app.use('/api/userTableData', userTableData);
app.use('/users', all_users);
app.use('/messages', messages);
app.use('/send_messages', send_messages);
app.use('/healthProfile',healthProfile);
app.use('/userProgram',userProgram);
app.use('/snack_options',snack_options);
app.use('/snacks_forms',snack_Form);
app.use('/supplementFields',supplementFields);
app.use('/updateHealthData',updateHealthData);

app.use('/updateHealthSnacksData', updateHealthSnacksData);
app.use('/clientdailyDateInserting', clientdailyDateInserting);
app.use('/dailyDietpics', dailyDietpics);


app.use('/ClientWeeklydataDateInserting', ClientWeeklydataDateInserting);
app.use('/Client_weekly_body_mesurements_update', Client_weekly_body_mesurements_update);
app.use('/Client_weekly_body_composition_update', Client_weekly_body_composition_update);
app.use('/Client_weekly_body_pictures_update', Client_weekly_body_pictures_update);


app.use('/chatMessagesUsersList', chatMessagesUsersList);
app.use('/graph', Graph);
app.use('/DashboardCard', DashboardCard);
app.use('/HealthFormDataFetched', HealthFormDataFetchedAndUpdating);


app.use('/api/coach', coachlogin);








// client_weekly_body_composition_update.js
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};


app.get("/",(req,res)=>{
  res.send(`This is an backend server workking port number: ${process.env.PORT}`);
  console.log("node ls working console message");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", port: process.env.PORT });
});






// File upload route
app.post('/upload', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    path: `/uploads/${req.file.filename}`,
    mimetype: req.file.mimetype,
    originalname: req.file.originalname,
  });
});

// Socket.IO Implementation with Status Tracking
const onlineUsers = {};

io.on('connection', (socket) => {
  console.log(`[Socket] New connection: ${socket.id}`);
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded payload:', decoded); // 👈 Check if username is there
      socket.userId = decoded.id;
      onlineUsers[decoded.id] = socket.id;
      socket.join(`user_${decoded.id}`);
      console.log(`[Socket] User (${decoded.id}) connected`);
      io.emit('onlineUsers', Object.keys(onlineUsers));
    } catch (err) {
      console.error('[Socket] Authentication failed:', err.message);
      socket.disconnect();
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      delete onlineUsers[socket.userId];
      io.emit('onlineUsers', Object.keys(onlineUsers));
      console.log(`[Socket] User ${socket.userId} disconnected`);
    }
  });

  socket.on('typing', ({ receiverId, isTyping }) => {
    if (socket.userId && receiverId) {
      io.to(`user_${receiverId}`).emit('typing', {
        senderId: socket.userId,
        isTyping,
      });
    }
  });

  socket.on('markAsDelivered', async (messageIds) => {
    console.log(`[Status] Received markAsDelivered for message IDs: ${messageIds.join(', ')}, user: ${socket.userId}`);
    try {
      const [beforeUpdate] = await db.query(
        'SELECT id, is_delivered, delivered_at, receiver_id, sender_id FROM messages WHERE id IN (?)',
        [messageIds]
      );
      console.log(`[Status] Before update: ${JSON.stringify(beforeUpdate)}`);

      const validMessages = beforeUpdate.filter(msg => msg.receiver_id === parseInt(socket.userId));
      if (validMessages.length === 0) {
        console.log(`[Status] No valid messages for user ${socket.userId}. Message data: ${JSON.stringify(beforeUpdate)}`);
        return;
      }

      const validMessageIds = validMessages.map(msg => msg.id);
      const timestamp = new Date();
      console.log(`[Status] Executing UPDATE query: messageIds=${validMessageIds}, receiver_id=${socket.userId}, timestamp=${timestamp}`);

      const [result] = await db.query(
        'UPDATE messages SET is_delivered = TRUE, delivered_at = ?, status = ? WHERE id IN (?) AND receiver_id = ? AND is_delivered = FALSE',
        [timestamp, 'delivered', validMessageIds, socket.userId]
      );

      console.log(`[Status] Update result: ${JSON.stringify(result)}`);

      if (result.affectedRows > 0) {
        const [updatedMessages] = await db.query(
          'SELECT id, is_delivered, delivered_at, status, sender_id, receiver_id FROM messages WHERE id IN (?)',
          [validMessageIds]
        );
        console.log(`[Status] After update: ${JSON.stringify(updatedMessages)}`);

        updatedMessages.forEach((msg) => {
          io.to(`user_${msg.receiver_id}`).emit('messageDelivered', {
            id: msg.id,
            timestamp: msg.delivered_at,
          });
          io.to(`user_${msg.sender_id}`).emit('messageDelivered', {
            id: msg.id,
            timestamp: msg.delivered_at,
          });
          console.log(`[Status] Notified delivery for message ${msg.id} to receiver ${msg.receiver_id} and sender ${msg.sender_id}`);
        });
      } else {
        console.log(`[Status] No messages updated for IDs: ${validMessageIds.join(', ')}. Possible reasons: already delivered, incorrect receiver_id, or no matching messages.`);
      }
    } catch (err) {
      console.error(`[Status] Error in markAsDelivered: ${err.message}, stack: ${err.stack}`);
    }
  });

  socket.on('markAsRead', async (messageIds) => {
    console.log(`[Status] Marking messages as read: ${messageIds.join(', ')}`);
    try {
      // Ensure messages are marked as delivered first
      const [undelivered] = await db.query(
        'SELECT id FROM messages WHERE id IN (?) AND receiver_id = ? AND is_delivered = FALSE',
        [messageIds, socket.userId]
      );
      if (undelivered.length > 0) {
        const undeliveredIds = undelivered.map(msg => msg.id);
        const timestamp = new Date();
        await db.query(
          'UPDATE messages SET is_delivered = TRUE, delivered_at = ?, status = ? WHERE id IN (?) AND receiver_id = ?',
          [timestamp, 'delivered', undeliveredIds, socket.userId]
        );
        console.log(`[Status] Marked as delivered before read: ${undeliveredIds.join(', ')}`);
      }

      const timestamp = new Date();
      const [result] = await db.query(
        'UPDATE messages SET is_read = TRUE, read_at = ?, status = ? WHERE id IN (?) AND receiver_id = ? AND is_read = FALSE',
        [timestamp, 'read', messageIds, socket.userId]
      );
      console.log(`[Status] Read query result: ${JSON.stringify(result)}`);

      if (result.affectedRows > 0) {
        const [updatedMessages] = await db.query(
          'SELECT id, sender_id, receiver_id FROM messages WHERE id IN (?)',
          [messageIds]
        );
        updatedMessages.forEach((msg) => {
          io.to(`user_${msg.receiver_id}`).emit('messageRead', { id: msg.id, timestamp });
          io.to(`user_${msg.sender_id}`).emit('messageRead', { id: msg.id, timestamp });
          console.log(`[Status] Notified read for message ${msg.id} to receiver ${msg.receiver_id} and sender ${msg.sender_id}`);
        });
      } else {
        console.log(`[Status] No messages marked as read for IDs: ${messageIds.join(', ')}`);
      }
    } catch (err) {
      console.error(`[Status] Error marking messages as read: ${err.message}`);
    }
  });
});


// ====================
// Send Messages Route
// ====================
app.post('/send_messages', authenticate, async (req, res) => {
  console.log('[Message] Route hit');
  console.log('[Message] Request body:', req.body);

  const { receiverId, message, file } = req.body;

  if (!receiverId || !message) {
    console.log('[Message] Missing required fields');
    return res.status(400).json({ error: 'receiverId and message are required' });
  }

  try {
    console.log(`[Message] From ${req.user.id} to ${receiverId}`);

    // Insert into tf_messages
    const [result] = await db.query(
      `INSERT INTO tf_messages 
        (sender_id, receiver_id, message, file_path, file_type, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        receiverId,
        message,
        file?.path || null,
        file?.type || null,
        'sent'
      ]
    );

    console.log(`[Message] Insert result:`, result);

    // Fetch the newly created message with sender info
    const [newMessage] = await db.query(
      `SELECT m.*, u.username AS sender_name
       FROM tf_messages m
       JOIN tf_users u ON m.sender_id = u.Cust_ID
       WHERE m.id = ?`,
      [result.insertId]
    );

    if (!newMessage.length) {
      console.log('[Message] No message found after insert');
      return res.status(500).json({ error: 'Message inserted but not found' });
    }

    const messageData = newMessage[0];
    console.log(`[Message] Created message ID: ${messageData.id}`);

    // Emit to receiver if online
    if (global.onlineUsers && onlineUsers[receiverId]) {
      console.log(`[Status] Receiver ${receiverId} is online, sending via socket`);
      io.to(`user_${receiverId}`).emit('newMessage', messageData);
    } else {
      console.log(`[Status] Receiver ${receiverId} is offline`);
    }

    // Always emit back to sender
    io.to(`user_${req.user.id}`).emit('newMessage', messageData);
    console.log(`[Socket] Sent message ${messageData.id} to sender ${req.user.id}`);

    // Send response
    res.json({ success: true, message: messageData });

  } catch (err) {
    console.error('[Message] Failed to send message:', err.message);
    res.status(500).json({ error: err.message });
  }
});



// Get message status route
app.get('/messageStatus/:messageId', authenticate, async (req, res) => {
  try {
    const [message] = await db.query(
      'SELECT is_delivered, is_read, delivered_at, read_at, status FROM messages WHERE id = ?',
      [req.params.messageId]
    );
    console.log(`[Status] Message status for ID ${req.params.messageId}: ${JSON.stringify(message[0])}`);

    if (!message[0]) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message[0]);
  } catch (err) {
    console.error(`[Status] Failed to get message status: ${err.message}`);
    res.status(500).json({ error: 'Failed to get message status' });
  }
});

// Fix inconsistent messages (temporary endpoint)
app.post('/api/fixMessages', authenticate, async (req, res) => {
  try {
    const timestamp = new Date();
    const [undelivered] = await db.query(
      'SELECT id, sender_id, receiver_id FROM tf_messages WHERE receiver_id = ? AND is_read = TRUE AND is_delivered = FALSE',
      [req.user.id]
    );

    if (undelivered.length > 0) {
      const messageIds = undelivered.map(msg => msg.id);
      const [result] = await db.query(
        'UPDATE tf_messages SET is_delivered = TRUE, delivered_at = ?, status = ? WHERE id IN (?) AND receiver_id = ?',
        [timestamp, 'read', messageIds, req.user.id]
      );
      console.log(`[Status] Fixed messages: ${JSON.stringify(result)}`);

      undelivered.forEach((msg) => {
        io.to(`user_${msg.receiver_id}`).emit('messageDelivered', { id: msg.id, timestamp });
        io.to(`user_${msg.sender_id}`).emit('messageDelivered', { id: msg.id, timestamp });
        console.log(`[Status] Notified delivery for fixed message ${msg.id}`);
      });
    }

    res.json({ success: true, fixed: undelivered.length });
  } catch (err) {
    console.error(`[Status] Error fixing messages: ${err.message}`);
    res.status(500).json({ error: 'Failed to fix messages' });
  }
});

// Logout routes
app.post('/api/logout', async (req, res) => {
  const sessionToken = req.cookies.session;
  await db.query('DELETE FROM session_token WHERE session_token = ?', [sessionToken]);
  res.clearCookie('session');
  res.json({ success: true });
});

app.post('/api/logout-all', async (req, res) => {
  const sessionToken = req.cookies.session;
  const [[userRow]] = await db.query('SELECT user_id FROM session_token WHERE session_token = ?', [sessionToken]);
  if (userRow) {
    await db.query('DELETE FROM session_token WHERE user_id = ?', [userRow.user_id]);
  }
  res.clearCookie('session');
  res.json({ success: true });
});

app.post('/api/logout-single', async (req, res) => {
  const { session_token } = req.body;
  const currentToken = req.cookies.session;

  const [[owner]] = await db.query('SELECT user_id FROM session_token WHERE session_token = ?', [currentToken]);
  const [[target]] = await db.query('SELECT user_id FROM session_token WHERE session_token = ?', [session_token]);

  if (owner?.user_id !== target?.user_id) return res.status(403).json({ success: false });

  await db.query('DELETE FROM session_token WHERE session_token = ?', [session_token]);
  res.json({ success: true });
});




app.get('/all_messages_notification_count', authenticate, async (req, res) => {
  try {
    const { senderId } = req.query;
    if (!senderId || parseInt(senderId) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Fetch all messages where user is sender or receiver
    const [messages] = await db.query(
      `SELECT m.*, u.first_name as sender_name
       FROM tf_messages m
       JOIN tf_users u ON m.sender_id = u.Cust_ID
       WHERE m.sender_id = ? OR m.receiver_id = ?
       ORDER BY m.timestamp ASC`,
      [senderId, senderId]
    );

    // Fetch unread message counts grouped by sender
    const [unreadCounts] = await db.query(
      `SELECT m.sender_id, u.first_name, COUNT(*) as unread_count
       FROM tf_messages m
       JOIN tf_users u ON m.sender_id = u.Cust_ID
       WHERE m.receiver_id = ? AND m.is_read = FALSE
       GROUP BY m.sender_id, u.first_name`,
      [senderId]
    );

    console.log(`[Messages] Fetched ${messages.length} messages for user ${senderId}`);
    console.log(`[Messages] Unread counts: ${JSON.stringify(unreadCounts)}`);

    res.json({
      messages,
      unreadCounts: unreadCounts.reduce((acc, curr) => {
        acc[curr.sender_id] = {
          username: curr.username,
          count: curr.unread_count,
        };
        return acc;
      }, {}),
    });
  } catch (err) {
    console.error(`[Messages] Failed to fetch messages: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


// Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});



