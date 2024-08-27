const FacebookTokenStrategy = require("passport-facebook-token");
const passport = require("passport");

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET_ID,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        return done(null, profile._json);
    } catch (err) {
        return done(err, false);
    }
}))

module.exports = passport