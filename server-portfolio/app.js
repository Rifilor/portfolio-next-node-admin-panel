// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const clientRoutes = require('./routes/clientRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// const userRoutes = require('./routes/userRoutes');
// const http = require('http');
// const { Server } = require('socket.io');



// const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//       origin: '*',
//     },
//   });

  
// io.on('connection', (socket) => {
//     console.log('connection')
//     activeTabs++;
//     io.emit('activeTabs', activeTabs);
  
//     socket.on('disconnect', () => {
//       activeTabs--;
//       io.emit('activeTabs', activeTabs);
//     });
//   });
  
//   app.get('/', (req, res) => {
//     res.send('WebSocket server is running');
//   });

// app.use(express.json());
// app.use(cors());

// app.use('/users', userRoutes);
// app.use('/clients', clientRoutes);
// app.use('/projects', projectRoutes);

// module.exports = app;


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

let activeTabs = 0;

io.on('connection', (socket) => {
    console.log('New client connected11');
    activeTabs++;
    io.emit('activeTabs', activeTabs);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        activeTabs--;
        io.emit('activeTabs', activeTabs);
    });
});

app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/clients', clientRoutes);
app.use('/projects', projectRoutes);

module.exports = { app, server };