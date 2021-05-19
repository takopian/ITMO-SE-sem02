const config = require("./config.json");
const User = require('./models/User');
const PORT = config.PORT || 5000;
const express = require('express');
const cors = require('cors');
// TODO const jwt = require('jsonwebtoken');
const http = require('http');
const passport = require('passport');
const socketio = require('socket.io');
const session = require('express-session');
const mongoose = require('mongoose');
const MainPageSocketListener = require('./socket_listeners/MainPageSocketListener');
const RoomPageSocketListener = require('./socket_listeners/RoomPageSocketListener');
const DurakSocketListener = require('./socket_listeners/game_sockets/DurakSocketListener');


const app = express();
const  server = http.createServer(app);
app.use(cors());
const io = socketio(server, {
    cors: {
        origin: '*',
    }
});

const roomIO = socketio(server, {
    cors: {
        origin: '*',
    },
    path: "/room"
});

const durakIO = socketio(server, {
    cors: {
        origin: '*',
    },
    path: "/game/durak"
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
                    user.name  = profile.name.givenName + (profile.name.familyName ? ' ' + profile.name.familyName : '');
                    user.pic = profile.photos[0].value;
                    user.save();
                    console.log("user found");
                    return done(null, user);
                } else {
                    const newUser = new User();
                    newUser.uid    = profile.id;
                    newUser.name  = profile.name.givenName + (profile.name.familyName ? ' ' + profile.name.familyName : '');
                    newUser.email = profile.emails[0].value;
                    newUser.pic = profile.photos[0].value;
                    newUser.isOnline = true;
                    newUser.joinedRoom = null;
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
let games = {};

io.on('connection', (socket) =>
    new MainPageSocketListener(socket, io, roomIO, games).listen()
);

roomIO.on('connection', (socket) =>
    new RoomPageSocketListener(socket, roomIO, games).listen()
);

durakIO.on('connection',(socket) =>
    new DurakSocketListener(socket, durakIO, roomIO, games).listen()
);

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
    // console.log(req.body);
    // let userId = JSON.parse(req.body).userId;
    // console.log(userId);
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
});

server.listen(PORT,() => {
    console.log(`App is listening on Port ${PORT}`)
});
