const express = require('express');
const router = express.Router();
const passport = require('passport');

const linkedinLogin = require('../use-case/authentication/linkedinLogin');
const response = require('../utils/response');
const responseHandler = require('../utils/response/responseHandler');

router.get('/auth/linkedin/error', (req, res) => {
  sendResponse(res,response.badRequest({ message:'Login Failed' }));
});

router.get('/auth/linkedin',passport.authenticate('linkedin', { 
  scope: ['r_emailaddress', 'r_liteprofile'],
  session:false 
}));

router.get('/auth/linkedin/callback',
  (req,res,next)=>{
    passport.authenticate('linkedin', { failureRedirect: '/auth/linkedin/error' }, async (error, user , info) => {
      if (error){
        return responseHandler(res,response.internalServerError({ message:error.message }));
      }
      if (user){
        try {
          let result = await linkedinLogin(user.email, req.session.platform);
          return responseHandler(res,result);
        } catch (error) {
          return responseHandler(res,response.internalServerError({ message: error.message }));
        }
      }
    })(req,res,next);
  });

module.exports = router;