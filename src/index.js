import express from 'express'
import logger from 'winston'
import winston from 'winston'
import dotenv from 'dotenv'
import {Server} from 'socket.io'
import { getConfig } from './config'
import { RegistrarDB } from './db'
import type { MessageRecord } from './db'

dotenv.config()

const config = getConfig()
const http = require('http');

winston.configure(config.winstonConfig)

const app = express()

const db = new RegistrarDB(config.dbLocation)
db.initialize()

const server = http.createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
     origin: '*',
     methods: ["GET", "POST"]
  }
})

app.get('/socket.io', (req, res) => {
    logger.info('Welcome to WebSocket Server Chat ')
    res.json({message: "Welcome to WebSocket Server Chat :)"});
})

io.of('/socket.io').on('connection', async (socket) => {
  logger.info('http - ApiServer - socketio --> a user has connected!')

  socket.on('disconnect', () => {
    logger.info('http - ApiServer - socketio --> a user has disconnected!')
  })

  socket.join("crosscheck");

  socket.on('chat message', async (msg) => {
    let result;
    let msgObject = JSON.parse(msg);
    let {
      messageUuid,
      messageUserId,
      messageTypeContract,
      messageNumberContract,
      messageDateTime,
      messageChat,
      messageAction
    } = msgObject;

    logger.info('http - ApiServer - socketio - msg --> ' + msg);
    logger.info('http - ApiServer - socketio - messageUserId --> ' + messageUserId);

    try {
      if (messageAction === 'delete') {
        result = await db.deleteDB(messageUuid);
      } else {
        result = await db.insertDB(messageUuid, messageUserId, messageTypeContract, messageNumberContract, messageDateTime.toString(), messageChat);
      }
    } catch (e) {
      logger.info('http - ApiServer - socketio - error --> ' + e);
    }
    logger.info('http - ApiServer - socketio - socket.emit --> ' + msg);
    //socket.emit('chat message', msg);
    //socket.to("crosscheck").emit(msg);
    socket.broadcast.emit("chat message", msg);
  });
});

server.listen(config.port, () => {
    logger.info('API CHAT Socket.io Service started on ' + config.port)
})
