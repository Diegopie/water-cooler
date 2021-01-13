const db = require('../models');
const router = require('express').Router();
const { Room, User } = require('../models');

// populates rooms page with public rooms
router
    .route('/')

    .get((req, res) => {
        console.log('/');
        Room
            .find({})
            .then(data => {
                res.json({ success: true, data });
            })
            .catch(err => {
                res.json({ success: false } + err);
            });
    });

// creates room
router
    .route('/create')
    .post((req, res) => {
        console.log(req.body);
        Room
            .create({
                roomName: req.body.roomName,
                roomDesc: req.body.roomDescription,
                publicRoomId: req.body.publicRoomId,
                roomCreator: req.body.userId
            })
            .then(data => {
                User
                    .find({ _id: { $in: req.body.roomFriends } })
                    .then(friendInfo => {
                        console.log('THIS IS MY FRIEND INFO', friendInfo[0])
                        // const functionThing = test(friendInfo);
                        for (let i = 0; i < friendInfo.length; i++) {
                            // console.log(data.publicRoomId);
                            User.inboundPendingRooms.push(friendInfo[i]._id, data.publicRoomId);
                        }
                    })
                // res.json({ success: true, data });
            })
            .catch(err => {
                res.json({ success: false } + err);
            });
        // User
        //     .find({

        //     })
    });

// gathers rooms based on id
router
    .route('/find')
    .post((req, res) => {
        Room
            .findOne({ _id: req.body.id })
            .then(data => {
                res.json({ success: true, data });
            })
            .catch(err => {
                res.json({ success: false } + err);
            });
    });

router
    .route('/findmany')
    .post(({ body }, res) => {
        Room
            .find({ _id: { $in: body.ids } })
            .then(data => {
                res.json({ success: true, data });
            })
            .catch(err => {
                res.json({ success: false } + err);
            });
    });

router
    .route('/users')
    .post(async ({ body }, res) => {
        try {
            // * Get DB Info for All IDs in idArray
            const roomUsers = await db.User.find({ _id: { $in: body.users } });
            // console.log({ roomUsers });
            // ** If no friends found, End Function
            if (!roomUsers) {
                console.log('No users found');
                res.json({ success: false });
                return;
            }
            // * Store Data To Send Back To Client
            const response = [];

            // * Loop Through Results to Store Relevant Data in an Object
            roomUsers.forEach(friends => {
                let userParsed = {
                    username: friends.username,
                    firstName: friends.firstName,
                    lastName: friends.lastName,
                    imageSrc: friends.imageSrc,
                    friendId: friends._id,
                    status: friends.status
                };
                // console.log(userParsed);

                // *** Push Each Result to response
                response.push(userParsed);
            });

            // ** Send Filtered Response to Client
            // console.log({ response });
            res.json({ success: true, retUsers: response });
        } catch (err) {
            console.log('/api/room/users: ', err);
        }
    });

// gathers rooms based on publicRoomId
router
    .route('/:id')
    .post((req, res) => {
        Room
            .findOne({ publicRoomId: req.body.publicRoomId })
            .then(data => {
                res.json({ success: true, data });
            })
            .catch(err => {
                res.json({ success: false } + err);
            });
    });



module.exports = router;