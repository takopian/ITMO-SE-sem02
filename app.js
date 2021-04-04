const config = require("./config.json");
const roomDAO = require('./dao/roomDAO');
const User = require('./models/User');
const DurakGame = require('./models/Durak/DurakGame')
const PORT = config.PORT || 5000;
const express = require('express');
const cors = require('cors');
// TODO const jwt = require('jsonwebtoken');
const http = require('http');
const passport = require('passport');
const socketio = require('socket.io');
const session = require('express-session');
const mongoose = require('mongoose');


const app = express();
const  server = http.createServer(app);
app.use(cors());
const io = socketio(server,{
    cors: {
        origin: '*',
    }
});

const roomIO = socketio(server,{
    cors: {
        origin: '*',
    },
    path: "/room"
});

mongoose.connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch((err) => console.log(err))

const facebookStrategy = require('passport-facebook').Strategy

passport.use(new facebookStrategy({
        clientID        : config.Facebook.clientID,
        clientSecret    : config.Facebook.clientSecret,
        callbackURL     : "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
    },
    function(token, refreshToken, profile, done) {

        process.nextTick(function() {
            User.findOne({ 'uid' : profile.id }, function(err, user) {

                if (err)
                    return done(err);
                if (user) {
                    user.isOnline = true;
                    user.save();
                    console.log("user found");
                    return done(null, user);
                } else {
                    const newUser = new User();
                    newUser.uid    = profile.id;
                    newUser.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.email = profile.emails[0].value;
                    newUser.pic = profile.photos[0].value;
                    newUser.isOnline = true;
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        })
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use(session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());
//app.use('/', express.static('./client/build'));

io.on('connection', async (socket) => {
    console.log("New socket connection.");

    socket.join('common room');
    const rooms = await roomDAO.getRooms();
    io.to('common room').emit('roomsData', {rooms});

    socket.on('create room', async ({name, user, game, isPrivate}) => {
        const newRoomId = await roomDAO.createRoom(name, user, game, isPrivate);
        console.log(newRoomId);
        socket.join(newRoomId);
        io.to(newRoomId).emit('room created', newRoomId);
        console.log("room created.");
        const rooms = await roomDAO.getRooms();
        io.to('common room').emit('roomsData', {rooms});
    });

    socket.on('join room', async ({user, roomId}) => {
        console.log(`user ${user._id} joined ${roomId}`);
        await roomDAO.joinRoom(roomId, user);
        const rooms = await roomDAO.getRooms();
        io.to('common room').emit('roomsData', {rooms});
    })

    socket.on('disconnect', () => {
        console.log('User had left.')
    });

});

roomIO.on('connection', async (socket) => {
    console.log("New room socket connection.");
    let game = {};

    socket.on('start game', async ({roomId}) => {
        console.log("start game");
        const room = await roomDAO.getRoomById(roomId);
        game = new DurakGame(room);
        game.startUp();
        console.log(game);
        roomIO.to(roomId).emit('game state', {game});

    })

    socket.on('next turn', async ({roomId, state}) => {
        game = state;
        game.endOfTurn();
        roomIO.to(roomId).emit('game state', {game});
    });

    socket.on('room info', async ( { roomId } ) => {
        console.log('room info');
        socket.join(roomId);
        const room = await roomDAO.getRoomById(roomId);
        roomIO.to(roomId).emit('info', {room});
    });
})

app.get('/profile', isLoggedIn, function(req, res) {
    res.send(req.user)
});

app.get('/logout', async (req, res) => {
    console.log("logout");
    if (req.user){
        const filter = {uid : req.user.uid};
        const update = {isOnline : false};
        await User.findOneAndUpdate(filter, update);
        req.user = {};
    }
    res.send({status: 'ok' });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

app.get('/auth/facebook',
    passport.authenticate('facebook', { scope : 'email' }));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

app.get('/', (req,res) => {
    console.log('Hi')
})

server.listen(PORT,() => {
    console.log(`App is listening on Port ${PORT}`)
})
