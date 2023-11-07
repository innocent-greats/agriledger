const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { USER_TYPES } = require('../constants/authConstant');

const linkedinPassportStrategy = ({ userDb }) => passport => {

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENTID,
    clientSecret: process.env.LINKEDIN_CLIENTSECRET,
    callbackURL: process.env.LINKEDIN_CALLBACKURL,
    scope: ['r_emailaddress', 'r_liteprofile'],
  }, async function (accessToken, refreshToken, profile, done) {
    try {
      if (profile){
        let userObj = {
          'username':profile.displayName,
          'linkedinId': profile.id,
          'email': profile.emails !== undefined ? profile.emails[0].value : '',
          'password':'',
          'userType':USER_TYPES.User
        };
        let found = await userDb.findOne({ 'email': userObj.email });
        if (found && found.id) {
          await userDb.update({ id:found.id }, userObj);
        }
        else {
          await userDb.createOne(userObj);
        }
        let user = await userDb.findOne({ 'linkedinId':profile.id });
        return done(null, user);
      }
      return done(null,null,'Profile Not found');
    } catch (error){
      return done(null, error);
    }
  }
  ));
};

module.exports = linkedinPassportStrategy;