const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ where: { email } });

        if (!user) {
          user = await User.create({
            first_name: profile.name?.givenName || "Unknown",
            last_name: profile.name?.familyName || "User",
            email,
            password: "",
            type: "client",
            phone_number: null, // Nullable field
            age: null, // Nullable field
            gender: null, // Nullable field
            terms_accepted: false,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;
        let user = await User.findOne({ where: { email } });

        if (!user) {
          user = await User.create({
            first_name: profile.name?.givenName || "Unknown",
            last_name: profile.name?.familyName || "User",
            email,
            password: "",
            type: "client",
            phone_number: null, // Nullable field
            age: null, // Nullable field
            gender: null, // Nullable field
            terms_accepted: false,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
