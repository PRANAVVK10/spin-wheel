const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var TwitchStrategy = require('passport-twitch-api').Strategy;
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

const googleScopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'email',
  'profile',
];

const googleStrategy = new GoogleStrategy(
  {
    clientID: '1022249698599-cvtmrmnk6gg8mj5er5lsmjnfd7poh3j1.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: `${config.server.host}/v1/auth/google/callback`,
    passReqToCallback: true,
    scope: googleScopes,
  },

  async function (request, accessToken, refreshToken, profile, done) {
    console.log({ accessToken, refreshToken, profile });
    return done(null, {
      google: { googleAccessToken: accessToken, googleRefreshToken: refreshToken, googleProfile: profile },
    });
  }
);

const twitchStrategy = new TwitchStrategy(
  {
    clientID: '91iddwyoev45f6dba8235ihdzzlzgy',
    clientSecret: 'y35o9s5eaoavz5sxiffk4xs8jf5pp5',
    callbackURL: `${config.server.host}/v1/auth/twitch/callback`,
    scope: 'user_read',
    grant_type: 'client_credentials',
  },

  async function (accessToken, refreshToken, profile, done) {
    console.log({ accessToken, refreshToken, profile });
    return done(null, { accessToken, refreshToken, profile });
  }
);

module.exports = {
  jwtStrategy,
  googleStrategy,
  twitchStrategy,
};
