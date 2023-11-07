/** 
 * smsService.js
 * @description :: exports function used in sending sms using nexmo provider
 */
const dotenv = require('dotenv');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Vonage = require('@vonage/server-sdk');

const sendSMS = async (obj) => {
  const vonage = new Vonage({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
  });
  let recipients = [];
  if (Array.isArray(obj.to)) {
    recipients = recipients.concat(obj.to);
  } else if (typeof obj.to === 'string') {
    const mobileArray = obj.to.split(',');
    recipients = recipients.concat(mobileArray);
  }
  const smsSent  = await Promise.all(recipients.map(async (mobileNo)=>{
    const samplePromise = new Promise((resolve,reject)=>{
      vonage.message.sendSms('BRAND_NAME', mobileNo,obj.message,(err,responseData)=>{
        if (err) {
          console.log(err);
        } else {
          if (responseData.messages[0]['status'] === '0') {
            resolve(true);
            console.log('Message sent successfully.');
          } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            reject(`Message failed with error: ${responseData.messages[0]['error-text']}`);
          }
        }
      });  
    });
    return samplePromise;
  }));
  return smsSent;
};
module.exports = { sendSMS };