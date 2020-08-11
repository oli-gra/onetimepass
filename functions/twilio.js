const twilio = require('twilio')

const accountSid = 'AC5e3606d72d6af8ae2f2cb0b8972a13b1'
const authToken = '69986a2223f56a6d5f6b5499717cb766'

module.exports = new twilio.Twilio(accountSid,authToken)