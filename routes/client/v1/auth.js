const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware');
const authController = require('../../../controller/client/v1/authentication');
const { PLATFORM } =  require('../../../constants/authConstant');

router.route('/register').post(authController.register);
router.route('/login').post(authController.authentication);

router.route('/forgot-password').post(authController.forgotPassword);
router.route('/validate-otp').post(authController.validateResetPasswordOtp);
router.route('/reset-password').put(authController.resetPassword);
router.route('/logout').post(auth(PLATFORM.CLIENT),authController.logout);
router.route('/push-notification/addPlayerId').post(authController.addPlayerId);
router.route('/push-notification/removePlayerId').post(authController.removePlayerId);
router.route('/login/linkedin').get((req,res)=>{
  req.session.platform = 'client';
  res.redirect(`http://localhost:${process.env.PORT}/auth/linkedin`);
});
router.route('/login/google').get((req,res)=>{
  req.session.platform = 'client';
  res.redirect(`http://localhost:${process.env.PORT}/auth/google`);
});

module.exports = router;
