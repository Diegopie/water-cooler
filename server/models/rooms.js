const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    publicID: {
        type: String,
        required: true
    },
    users: {
        type: Array,
        default: []
    }
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
