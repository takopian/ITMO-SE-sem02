const facebookStrategy = require('passport-facebook').Strategy
const User = require('../models/User');
const config = require("../config.json");

const strategy = new facebookStrategy({
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
    });

module.exports = strategy