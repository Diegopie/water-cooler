const router = require('express').Router();
const auth = require('./auth.routes');
const friends = require('./friends.routes');
const rooms = require('./room.routes');
const socialSpaces = require('./socialspace.routes');
const sockets = require('./socket.routes');
const chats = require('./chat.routes');

//authenticated user route
router.use('/api/user', auth); 
router. use('/api/friends', friends);
router.use('/api/room', rooms);
router.use('/api/socialspace', socialSpaces);
router.use('/api/socket', sockets);
router.use('/api/chat', chats);

module.exports = router;
